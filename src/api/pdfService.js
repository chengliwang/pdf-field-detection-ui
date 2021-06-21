const getFilename = (disposition) => {
    let filename = "download.pdf";
    try{
        filename = disposition.split(';')[1].split('=')[1].trim();
    } catch(err) {
        console.log(err);
    }
    return filename;
}

export async function predictPdf(baseUrl, file) {
    try
    {
        const formData = new FormData();
        formData.append('pdf', file);
        let response = await
            fetch(`${baseUrl}/v1/predict`, {
                method: 'POST',
                body: formData
            })
            .then(r =>  r.json().then(data => ({
                status: r.status, 
                response: data
            })))
        return await response;
    }
    catch(err)
    {
        console.log(err);
    }
}

export async function getPredictStatus(baseUrl, url, taskId) {
    try {
        let response = await
            fetch(`${baseUrl}${url}/${taskId}`, {
                method: 'GET'
            })
            .then(r => r.headers.get("Content-Type") === 'application/json' ? 
                            r.json() : {
                                state: 'SUCCESS',
                                filename: getFilename(r.headers.get('content-disposition') || ''),
                                blob: r.blob()
                            })
        return await response;
    }
    catch(err)
    {
        console.log(err);
    }
}