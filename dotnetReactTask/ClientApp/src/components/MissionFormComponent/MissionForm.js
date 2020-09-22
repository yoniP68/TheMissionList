import React, { Component, Fragment, useCallback } from 'react';
import './MissionForm.scss';
import TextField from '@material-ui/core/TextField';
import Dropzone from 'react-dropzone';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

export class MissionForm extends Component {
    static displayName = MissionForm.name;
    constructor(props) {
        super(props);
        this.state = {
            mission: {
                missionDesc: '',
                file: null,
            },
            errors: {
                missionDesc: '',
                file: ''
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    /** Validate that the mission has a description. */
    validateForm() {
        return (this.state.mission.missionDesc.trim().length > 0)
    }

    /** Set the state after an input change */
    handleInputChange(event) {
        event.preventDefault();
        const { name, value } = event.target;
        let missionDescErrors = '';
        if (name === 'missionDesc') {
            let trimed = value.trim();
            missionDescErrors = trimed.length < 1 ? 'Mission description is required.' : '';
        }

        this.setState(prevState => {
            let errors = { ...prevState.errors }
            let mission = { ...prevState.mission }
            errors.missionDesc = missionDescErrors;
            mission[name] = value;
            return { mission, errors };
        });
    }

    /**
     * Call handleInputChange.
     * This will set the error when a field is blured without a value.
     */
    handleBlur(event) {
        this.handleInputChange(event);
    }

    /** Submit the form if it is valid. */
    handleSubmit(event) {
        event.preventDefault();
        if (this.validateForm()) {
            this.props.addMission(this.state.mission);
            this.setState({
                mission: {
                    missionDesc: '',
                    file: null,
                }
            });
        } else {
            this.props.showErrorBar('Invalid form');
        }
    }

    /** Set the file state when a file is selected or dropped */
    onPreviewDrop = (files, rejected) => {
        let errors = { ...this.state.errors }
        let mission = { ...this.state.mission }
        if (rejected.length || files.length > 1) {
            errors.file = "Rejected, please select one image, under 7Mb."
            this.setState({ errors });
            return;
        }

        fileToDataUri(files[0])
            .then(dataUri => {
                errors.file = '';
                mission.file = dataUri;
            })
            .catch(err => {
                errors.file = 'Error occurred while loading file.';
            })
            .finally(() => {
                this.setState({ mission, errors });
            });

    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} autoComplete="off" id="mission-form">
                <TextField
                    id="mission-desc"
                    label="Mission description"
                    multiline
                    rowsMax={4}
                    fullWidth
                    name="missionDesc"
                    value={this.state.mission.missionDesc}
                    onChange={this.handleInputChange}
                    onBlur={this.handleBlur}
                    variant="outlined"
                    error={this.state.errors.missionDesc !== ""}
                />
                <Dropzone fullWidth onDrop={this.onPreviewDrop} multiple={false} maxSize={7340032} accept="image/*">

                    {({ getRootProps, getInputProps, isDragAccept, isDragReject }) => {
                        let classes = 'form-control drop-file'
                        let placeholder = <p>Drag file here, or click to select file</p>;
                        if (isDragAccept) {
                            classes = `${classes} border-success bg-light`;
                            placeholder = <p className="text-success">Drop file now</p>;
                        }
                        else if (isDragReject) {
                            classes = `${classes} border-danger bg-light`;
                            placeholder = <p className="text-danger">Not allowed</p>
                        }
                        return (
                            <div {...getRootProps()} className={classes}>
                                <input {...getInputProps()} />
                                {placeholder}
                                <p id="file-error">{this.state.errors.file}</p>
                                {this.state.mission.file != null &&
                                    <Fragment>
                                        <h3>Preview</h3>
                                        <Avatar alt="Preview" src={this.state.mission.file} className="preview large" />
                                    </Fragment>
                                }
                            </div>
                        )
                    }}
                </Dropzone>
                <Button type="submit" endIcon={<AddIcon />} disabled={!this.validateForm()} fullWidth className="form-control submit">Add Mission</Button>
            </form>
        );
    }
}

/** Get string URI from a file. */
const fileToDataUri = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        resolve(event.target.result)
    };
    reader.readAsDataURL(file);
});