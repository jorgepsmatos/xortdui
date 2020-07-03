import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const [url, setUrl] = useState('');
    const [slug, setSlug] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState('');

     const createShortUrl = async (e) => {
        e.preventDefault();

        let endpoint = 'https://localhost:5001/create';
        let options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                url,
                slug
            })
        };
        try {
            let response = await fetch(endpoint, options);
            let responseOK = response && response.ok;
            if (responseOK) {
                let data = await response.json();
                // do something with data
                console.log(data)
                setResult("https://localhost:5001/" + data.slug);
            } else {
                setError("Failed to create short url");
            }
        }catch (e) {
            setError("Failed to create short url");
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <form onSubmit={createShortUrl}>
                    <label>
                        Url:
                        <input name="url" type="text" value={url} onChange={e => setUrl(e.target.value)}/>
                    </label>
                    <label>
                        Slug:
                        <input name="slug" type="text" value={slug} onChange={e => setSlug(e.target.value)}/>
                    </label>
                    <button>Submit</button>
                    {result && <div>{result}</div>}
                    {error && <div>{error}</div>}
                </form>
            </header>
        </div>
    );
}

export default App;
