import React, {useState} from 'react';
import CardContent from "@material-ui/core/CardContent";
import {Button, Snackbar, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import {useForm} from "react-hook-form";
import {Alert} from "../Alert/Alert";

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down(600)]: {
            minWidth: '100%'
        },
        [theme.breakpoints.up(600)]: {
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
    button: {
        lineHeight: 2
    },
    result: {
        margin: '1rem 0 0',
        cursor: 'pointer',
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: 'bold',
    },
    inputError: {
        color: 'red',
        display: 'flex',
        justifyContent: 'left',
        padding: '0 0.5rem 1rem',
    }
}));

export const FormCard = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState('');
    const [slug, setSlug] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
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
    const classes = useStyles();

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

    const copyToClipboard = async () => {
        navigator.clipboard.writeText(result).then(() => {
            // alert('Copied ' + result + ' to clipboard');
            openSnackbar();
        }, () => {
            alert('Failed to copy ' + result + ' to clipboard');
        });
    }

    const openSnackbar = () => {
        setOpen(true);
    };

    const closeSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={closeSnackbar}  anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert severity="success" >
                    Copied {result} to clipboard!
                </Alert>
            </Snackbar>
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
                                fullWidth
                            />
                            {errors.url && <div className={classes.inputError}>Url is empty or invalid</div>}
                        </div>
                        <div className="formInput">
                            <TextField
                                name="slug"
                                label="Slug (optional)"
                                value={slug}
                                onChange={e => setSlug(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                inputRef={register({
                                    pattern: /[\w.-~!$&'()*+,;:@]+/gi
                                })}
                                fullWidth
                            />
                            {errors.slug && <div className={classes.inputError}>Slug is invalid</div>}
                            {error && <div className={classes.inputError}>{error}</div>}
                        </div>
                        <div className={classes.marginTopSpacer}>
                            <Button type="submit" color="primary" variant="contained" className={classes.button}>
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
        </>
    )
}