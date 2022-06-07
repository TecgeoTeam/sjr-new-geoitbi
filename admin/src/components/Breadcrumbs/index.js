import React from 'react';
import { Link  } from "react-router-dom";

class Breadcrumbs extends React.Component {

    render() {
    
        return (
            <>
                
                <div className="page-title-area">
                    <div className="row align-items-center">
                        <div className="col-sm-12">
                            <div className="breadcrumbs-area">
                                <h4 className="page-title pull-left">{this.props.pagetitle}</h4>
                                <ul className="breadcrumbs pull-left">
                                    <li><Link to="/dashboard">Início</Link></li>
                                    <li><span>{this.props.pagetitle}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </>
        );
    }  
}


export default Breadcrumbs;


