import React, {useState} from 'react';
import './App.css';
import {makeStyles} from '@material-ui/core/styles';
import {
    Button,
    TextField
} from '@material-ui/core';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import {useForm} from "react-hook-form";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

function App() {
    const [url, setUrl] = useState('');
    const [slug, setSlug] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState('');
    const classes = useStyles();
    const {register, handleSubmit, watch, errors} = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
        defaultValues: {},
        resolver: undefined,
        context: undefined,
        criteriaMode: "firstErrorDetected",
        shouldFocusError: true,
        shouldUnregister: true,
    });

    const createShortUrl = async () => {
        let endpoint = 'https://xortd.com/shorturl';
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
                setResult("https://xortd.com/" + data.slug);
            } else {
                setError("Failed to create short url");
            }
        } catch (e) {
            setError("Failed to create short url");
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <Card className={classes.root}>
                    <CardHeader className={classes.title}
                                title="Xortd"
                                subheader="A url shortner"
                    />
                    <CardContent>
                        <form onSubmit={handleSubmit(createShortUrl)} autoComplete="off">
                            <div className="formInput">
                                <TextField
                                    name="url"
                                    label="Url"
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                    inputRef={register({
                                        required: true,
                                        pattern: /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi
                                    })}
                                    fullWidth
                                />
                                <div className="inputError">{errors.url && "Url is empty or invalid"}</div>
                            </div>
                            <div className="formInput">
                                <TextField
                                    name="slug"
                                    label="Custom slug (optional)"
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                    inputRef={register({
                                        pattern: /[\w.-~!$&'()*+,;:@]+/gi
                                    })}
                                    fullWidth
                                />
                                <div className="inputError">{errors.slug && "Slug is invalid"}</div>
                                <div className="inputError">{error}</div>
                            </div>
                            <Button type="submit" color="primary" variant="contained">
                                Create
                            </Button>
                            <div className="result">
                                {result && <a href={result}>{result}</a>}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </header>
        </div>
    );
}

export default App;
