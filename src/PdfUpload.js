import React, { useEffect, useState } from "react";
import { Form, ProgressBar } from 'react-bootstrap';
import bsCustomFileInput from "bs-custom-file-input"
import { predictPdf, getPredictStatus } from "./api/pdfService";

const PdfUpload = () => {
  useEffect(() => {bsCustomFileInput.init()}, []);
  let [ showProgress, setShowProgress ] = useState(false);
  let [ progress, setProgress ] = useState(0);
  let [ label, setLabel ] = useState("");
  let refreshIntervalId;
  let saved = false;
  let serviceUrl = "https://pdf-field-detection-svc.eastus2.azurecontainer.io";

  const savePdf = (response) => {
    setProgress(100);
    setLabel("Saving the file ...");        
    response.blob.then((blob) => {            
      const newBlob = new Blob([blob], { type: 'application/pdf' });          
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
      } else {         
        const url = window.URL.createObjectURL(newBlob);
        let link = document.createElement('a');
        link.href = url;
        link.download = response.filename.replace(' ', '')
        link.click();
        setTimeout(() => { window.URL.revokeObjectURL(url); }, 250);
      }
      setShowProgress(false);
      setProgress(0);
    })    
  }  
    
  const checkStatus = (url, task_id) => {
    getPredictStatus(serviceUrl, url, task_id).then(result => {
        if (result.state === 'SUCCESS') {
            clearInterval(refreshIntervalId);
            if (!saved) {
                savePdf(result);
                saved = true;
            }        
        } else if (result.state === 'PROGRESS') {
            setLabel(result.info);
            let message = result.info;
            if (message.match(/Removing password/i)) {                    
                setProgress(5);
            }                    
            else if (message.match(/Get.*prediction/i)) {
                setProgress(95);
            }                    
            else {
                var regex = /Extracting page (\d+) of (\d+)/i;
                var match = regex.exec(message);
                if (match != null) {
                    setProgress(progress + parseInt(match[1]) * 90.0 / parseInt(match[2]) );
                }
            }                
        } else if (result.state === 'FAILURE') {
            clearInterval(refreshIntervalId);
            setLabel(result.info);
        }
    });
  }

  const uploadPdf = (event) => {    
    saved = false;
    let file = event.target.files[0];
    if (file) {
        setShowProgress(true);
        setProgress(0);
        setLabel('Uploading ' + file.name + ' ....');
        predictPdf(serviceUrl, file).then(resp => {
          if (resp?.status === 202) {
            setProgress(3);
            refreshIntervalId = setInterval(() => {
              checkStatus(resp.response.url, resp.response.task_id);
            }, 200)
          }
          else {
              setLabel("Error uploading PDF: status code " + resp?.status);
          }
        });
    }
  };

  return(
    <div>
      <Form style={{ width: '50%' }}>
        <Form.Group controlId="uploadPdf">
          <Form.Label>
            Detecting form fields in a PDF using machine learning.
          </Form.Label>
          <Form.File type="file" accept="application/pdf" label="" data-browse="Upload PDF File" custom onChange={uploadPdf} />   
        </Form.Group>      
      </Form>
    {showProgress ?
      <div>
        <span>{label}</span>
        <ProgressBar animated now={progress} label={`${Math.round(progress)}%`} />
      </div> :
      <div />
    }
    </div>    
  );
}

export default PdfUpload;
