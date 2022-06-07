import React from 'react';
import './style.css'
import ScaleLoader from "react-spinners/ScaleLoader";

class PageLoading extends React.Component {

    render() {
        return (
            <>
                <div className="loading__centered" >
                    <div className="loading__logo">
                        <ScaleLoader size={20} color={"#fafafa"} />
                    </div>
                    
                </div>
            </>
        );
    }
     
}


export default PageLoading;


