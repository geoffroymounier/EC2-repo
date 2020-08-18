import React from 'react';

const Layout = ({ children }) => (
    <div className="container-fluid" style={{ background: '#F3610E', height: '100vh' }}>
        <div className="row justify-content-center">
            <div className="col-sm-8">
                <div className="card m-3 ">
                    <div className="col">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default Layout;