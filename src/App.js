import React, {useState} from 'react';
import './App.css';
import {makeStyles} from '@material-ui/core/styles';
import {
    Button,
    TextField
} from '@material-ui/core';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {useForm} from "react-hook-form";

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down(600)]: {
            minWidth: '100%'
        },
        [theme.breakpoints.up(720)]: {
            minWidth: '70%'
        },
        [theme.breakpoints.up(900)]: {
            minWidth: 600
        }
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
    marginTopSpacer: {
        marginTop: '0.75rem',
        display: "grid"
    },
    result: {
        margin: '1rem 0 0',
        cursor: 'pointer',
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: 'bold',
    }
}));

function App() {
    const [url, setUrl] = useState('');
    const [slug, setSlug] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState('');
    const classes = useStyles();
    const {register, handleSubmit, errors} = useForm({
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
        let endpoint = process.env.REACT_APP_XORTD_API_ENDPOINT + '/shorturl';
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
                setResult(response.headers.get('location'));
            } else {
                setError("Failed to create short url");
            }
        } catch (e) {
            setError("Failed to create short url");
        }
    }

    const getFromClipboard = async () => {
        const clipboard = await navigator.clipboard.readText();

        if (clipboard && clipboard.match(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?/gi)) {
            setUrl(clipboard);
        }
    }

    const copyToClipboard = async () => {
        navigator.clipboard.writeText(result).then(() => {
            alert('Copied ' + result + ' to clipboard');
        }, () => {
            alert('Failed to copy ' + result + ' to clipboard');
        });
    }

    return (
        <div className="App">
            <div className="card-container">
                <h1>XORTD</h1>
                <h2>A url shortener</h2>
                <Card className={classes.root}>
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
                                        pattern: /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?/gi
                                    })}
                                    onFocus={getFromClipboard}
                                    fullWidth
                                />
                                {errors.url && <div className="inputError">Url is empty or invalid</div>}
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
                                {errors.slug && <div className="inputError">Slug is invalid</div>}
                                {error && <div className="inputError">{error}</div>}
                            </div>
                            <div className={classes.marginTopSpacer}>
                                <Button type="submit" color="primary" variant="contained">
                                    Create
                                </Button>
                                {
                                    result && <div className={classes.result} onClick={copyToClipboard}>
                                        {result} (click to copy)
                                    </div>
                                }
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default App;
