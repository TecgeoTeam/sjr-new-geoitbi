import React from 'react';
import './style.css'
import ScaleLoader from "react-spinners/ScaleLoader";

class WidgetLoading extends React.Component {

    render() {
        return (
            <>
                <div className="loading_widget_centered" >
                    <div className="scaleLoader_widget_panel">
                        <ScaleLoader size={22} color={"#fafafa"} />
                    </div>
                </div>
            </>
        );
    }
     
}


export default WidgetLoading;


