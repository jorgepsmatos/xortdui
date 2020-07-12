import React from 'react';
import './App.css';
import {makeStyles} from '@material-ui/core/styles';
import {FormCard} from "./Components/FormCard/FormCard";

const useStyles = makeStyles(() => ({
    cardContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        marginBottom: 0,
    },
    subTitle: {
        marginBottom: 0,
    },
    description: {
        fontWeight: 'normal',
        marginTop: 0,
    }
}));

function App() {
    const classes = useStyles();

    return (
        <div className={classes.app}>
            <div className={classes.cardContainer}>
                <h1 className={classes.title}>XORTD</h1>
                <h2 className={classes.subTitle}>A url shortener</h2>
                <h3 className={classes.description}>Create custom short urls for free</h3>
                <FormCard />
            </div>
        </div>
    );
}

export default App;
