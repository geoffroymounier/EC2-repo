import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const URL = process.env.NODE_ENV == 'production' ? '' : `http://localhost:${process.env.PORT}`;

const useQuery = () => {
    const json = {}
    const search = useLocation().search
    new URLSearchParams(search).forEach((value, key) => json[key] = value);
    return json
}
const ResetPass = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const { userId, token } = useQuery();

    const onSubmit = (values, { setSubmitting }) => {
        const { password } = values
        const body = {
            password,
            token,
            userId
        }
        fetch(URL + '/newPassword', {
            method: 'post',
            body: JSON.stringify(body),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(async res => {
            const {status,message} = JSON.parse(await res.text());
            if (status === 200) {
                return location.href = '/successReset';
            } else {
                setSubmitting(false)
                setErrorMessage(message)
            }
          })
          .catch(err => {
              console.log(err, URL)
            setSubmitting(false)
            setErrorMessage('Une erreur inconnue vient de se produire')
          });
    }
    const initialValues = {
        password: '',
        confirmPassword: ''
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 'Please enter a pass of at least 8 characters, with one lowerCase, one upperCase and one digit at least, ')
            .required('Please enter a password'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'passwords are different')
            .required('Please confirm password'),
    });
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ values, errors, touched, isSubmitting }) => (
                <Form>
                    <div className="form-group">
                        <label>Password</label>
                        <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                        <ErrorMessage name="password" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                        <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-row">
                        <div className="form-group col">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                          Reset Password
                      </button>
                        </div>
                    </div>
                    {errorMessage && <div class="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>}

                </Form>
            )}
        </Formik>
    )

}

export default ResetPass;