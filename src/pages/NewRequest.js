import { useState } from 'react';
import '../css/NewRequest.css';

import UnderDevelopment from '../components/UnderDevelopment';

const NewRequest = () => {

    const [code, setCode] = useState('fetch-then');

    const [Response, setResponse] = useState({ "Messege": "Welcome to EasyFetch" });
    const [ResHeaders, setResHeaders] = useState(null);
    const [Status, setStatus] = useState(null);
    const [Size, setSize] = useState(null);
    const [Time, setTime] = useState(null);
    const [resError, setResError] = useState(false);
    const [error, setError] = useState(false);

    const [opt, setOpt] = useState(null);

    const [url, setUrl] = useState('https://minsta-server.herokuapp.com/');
    const [method, setMethod] = useState('GET');
    const [body, setBody] = useState(null);
    const [ReqHeaders, setReqHeaders] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [ReqTab, setReqTab] = useState(4);
    const [ResTab, setResTab] = useState(1);

    const sendFetch = async () => {
        setIsPending(true);
        setError(false);
        setResError(false);
        if (!url) return setError("Invalid URL");
        const options = { method };
        if (body && method !== 'GET') options.body = beautifyJSON(body);
        if (ReqHeaders) options.headers = JSON.stringify(JSON.parse(ReqHeaders), null, 4)
        console.log(options);
        setOpt(options);
        let t0 = performance.now();
        try {
            const res = await fetch(url, options)
            setStatus(res.status + ' ' + res.statusText);
            setSize(res.headers.get("content-length"));
            if (res.ok) {
                const json = await res.json();
                setResponse(json);
                console.log(res, json);
                let he = {};
                res.headers.forEach((value, name) => he[name.toString()] = value);
                setResHeaders(he);
            }
            else {
                console.log(res);
                setResponse({ "error": res.statusText });
                setResError(true);
            }
        } catch (error) { setError(error.message); }

        let t1 = performance.now();
        setTime(Math.round(t1 - t0) + ' ms');
        setIsPending(false);
    }

    const beautifyJSON = (payload)=>{
        try {
            return JSON.stringify(JSON.parse(payload), null, 4);
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="new-request">
            <div className='request'>
                <div className="request-head">
                    <div className='method'>
                        <select name="method" defaultValue={method} onChange={(e) => setMethod(e.target.value)}>
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PATCH">PATCH</option>
                            <option value="DELETE">DELETE</option>
                        </select>
                    </div>
                    <div id='url' className='url'>
                        <input type="text"
                            value={url}
                            onChange={(e) => { setUrl(e.target.value); setOpt(0); }}
                            placeholder='Enter URL' />
                    </div>
                    <div className='send' onClick={sendFetch}>Send</div>
                </div>
                <div>
                    <div className="body-headers body-head">
                        <div className={ReqTab === 1 ? 'set' : ''} onClick={() => setReqTab(1)}>Query</div>
                        <div className={ReqTab === 2 ? 'set' : ''} onClick={() => setReqTab(2)}>Headers</div>
                        <div className={ReqTab === 3 ? 'set' : ''} onClick={() => setReqTab(3)}>Auth</div>
                        <div className={ReqTab === 4 ? 'set' : ''} onClick={() => setReqTab(4)}>Body</div>
                        <div className={ReqTab === 5 ? 'set' : ''} onClick={() => setReqTab(5)}>Tests</div>
                    </div>
                </div>
                {ReqTab === 1 && <UnderDevelopment section="Query" />}
                {ReqTab === 2 && <UnderDevelopment section="Headers" />}
                {ReqTab === 3 && <UnderDevelopment section="Auth" />}
                {ReqTab === 4 && <div className='req-body'>
                    <div onClick={() => setBody(beautifyJSON(body))}>Format</div>
                    <textarea value={body} onChange={(e) => { setBody(e.target.value) }} cols="30" rows="10"></textarea>
                </div>}
                {ReqTab === 5 && <UnderDevelopment section="Tests" />}
            </div>
            {isPending ? <div className='msg'>Loading ...</div> :
                error ? <div className='msg' style={{color:'red'}}>{error}</div> :
                    <div className='response'>
                        <div className='meta'>
                            Status: <span style={resError ? { color: 'red' } : {}}>{Status}</span>
                            Size: <span>{Size} Bytes</span>
                            Time: <span>{Time}</span>
                        </div>
                        <div className="response-body body-head">
                            <div className={ResTab === 1 ? 'set' : ''} onClick={() => setResTab(1)}>Response</div>
                            <div className={ResTab === 2 ? 'set' : ''} onClick={() => setResTab(2)}>Headers</div>
                            <div className={ResTab === 3 ? 'set' : ''} onClick={() => setResTab(3)}>Cookies</div>
                            <div className={ResTab === 4 ? 'set' : ''} onClick={() => setResTab(4)}>Result</div>
                            <div className={ResTab === 5 ? 'set' : ''} onClick={() => setResTab(5)}>Docs</div>
                            <div className={ResTab === 6 ? 'set' : ''} onClick={() => setResTab(6)}>Code</div>
                        </div>
                        {ResTab === 1 && <div >{Response &&
                            <pre>
                                {JSON.stringify(Response, null, 2)}
                            </pre>
                        }</div>}
                        {ResTab === 2 &&
                            <pre>
                                {JSON.stringify(ResHeaders, null, 2)}
                            </pre>}
                        {ResTab === 3 && <UnderDevelopment section="Cookies" />}
                        {ResTab === 4 && <UnderDevelopment section="Result" />}
                        {ResTab === 5 && <UnderDevelopment section="Docs" />}
                        {ResTab === 6 && (
                            opt ?
                                <div className='code'>
                                    <div className='select-code'>
                                        <select name="lang">
                                            <option value="js">JavaScript</option>
                                        </select>
                                        <select name="Method" defaultValue='fetch-then' onChange={(e) => setCode(e.target.value)}>
                                            <option value="async-await">async-await</option>
                                            <option value="fetch-then">fetch-then</option>
                                        </select>
                                    </div>
                                    {code === "async-await" ?
                                        <pre>
                                            {`const options = ${JSON.stringify(opt, null, 2)}\n`}
                                            {`const url = '${url}'\n`}
                                            {`try {\n`}
                                            {`\tconst res = await fetch(url, options)\n`}
                                            {`\tif (res.ok) {\n`}
                                            {`\t\tconst json = await res.json();\n`}
                                            {`\t\tconsole.log(json);\n`}
                                            {`\t}\n`}
                                            {`\telse {\n`}
                                            {`\t\tconsole.log(res);\n`}
                                            {`\t}\n`}
                                            {`} catch (error) {\n`}
                                            {`\tconsole.log(error);\n`}
                                            {`}`}
                                            {'\n\nNote : This Code must be inside a async function to be work'}
                                        </pre> :
                                        <pre>
                                            {`const options = ${JSON.stringify(opt, null, 2)}\n`}
                                            {`fetch('${url}', options)\n`}
                                            {'.then(res => res.json())\n'}
                                            {'.then(json => console.log(json)\n'}
                                            {'.catch(err => console.error(err));'}
                                        </pre>
                                    }
                                </div>
                                : <div className='soon'>You must send request to generate code</div>
                        )}
                    </div>
            }
        </div>
    );
}
export default NewRequest;