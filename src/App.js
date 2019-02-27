import React, {Component} from 'react';
import {apiFetch} from "./general/Session";

class App extends Component {

    state = {};

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.hasOwnProperty("model"))
            return {
                modelPromise: apiFetch('GET', '/sample/api/model'),
                model: {},
            };
        else {
            return prevState;
        }
    }

    componentDidMount() {
        if (this.state.modelPromise !== null) {
            this.state.modelPromise.then(({status, result: model}) => {
                if (status === "success") {
                    this.setState({model, modelPromise: null});
                } else {
                    console.log('Failed to fetch model.')
                    this.setState({modelPromise: null});
                }
            })
        }
    }


    render() {
        let {model} = this.state;
        return (
            <h1 className="App">
                {model.title || "Loading..."}
            </h1>
        );
    }
}

export default App;
