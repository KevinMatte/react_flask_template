import React, {Component} from 'react';
import {apiFetch} from "./general/Session";

class App extends Component {

    state = {
        title: "Loading...",
        body: "This is a sample body that's to be loaded from the flask services."
    };

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
            <div className="max_size">
                <div className="flexVDisplay max_size">
                    <h1 className="flexFixed flexAlignCenter">
                        {model.title || "Loading..."}
                    </h1>
                    <div className="flexFixed flexHDisplay max_size">
                        <div className="flexFixed">
                            <ul>
                                <li>Menu item one</li>
                                <li>Menu item two</li>
                                <li>Menu item three</li>
                            </ul>
                        </div>
                        <div className="flexHStretched flexAlignMiddle ">
                            {model.body}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
