import classNames from 'classnames';
import {
    Autocomplete,
    Div100vhContainer,
    Icon,
    Input,
    ThemedScrollbars,
    DesktopWrapper,
    MobileWrapper,
} from '@deriv/components';
import { Formik, Field } from 'formik';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { isDesktop, isMobile } from '@deriv/shared/utils/screen';
import { localize, Localize } from '@deriv/translations';
import { toMoment } from 'Utils/Date';
import FormSubmitButton from './form-submit-button.jsx';
import DatePickerCalendar from './date-picker-calendar.jsx';
import 'Sass/details-form.scss';

export class DateOfBirth extends React.Component {
    state = {
        should_show_calendar: false,
        max_date: toMoment().subtract(18, 'years'),
        min_date: toMoment().subtract(100, 'years'),
        date: toMoment()
            .subtract(18, 'years')
            .unix(),
    };

    constructor(props) {
        super(props);
        this.reference = React.createRef();
    }

    closeDatePicker = () => {
        this.setState(
            {
                should_show_calendar: false,
            },
            () => {
                if (this.props.onFocus) {
                    this.props.onFocus(false);
                }
            }
        );
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, { passive: true });
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick);
    }

    handleClick = e => {
        if (!this.reference.current) {
            return;
        }
        if (!this.reference.current.contains(e.target)) {
            this.setState(
                {
                    should_show_calendar: false,
                },
                () => {
                    if (this.props.onFocus) {
                        this.props.onFocus(false);
                    }
                }
            );
        }
    };

    handleFocus = () => {
        this.setState(
            {
                should_show_calendar: true,
            },
            () => {
                if (this.props.onFocus) {
                    this.props.onFocus(true);
                }
            }
        );
    };

    render() {
        return (
            <Field
                id={this.props.id}
                name={this.props.name}
                render={({ field: { name, value }, form: { setFieldValue, handleBlur, errors, touched } }) => (
                    <div className='datepicker'>
                        <DesktopWrapper>
                            <InputField
                                {...this.props}
                                onFocus={this.handleFocus}
                                className={classNames(this.props.className, {
                                    'datepicker--active-label': !!value,
                                })}
                                onBlur={handleBlur}
                                value={value ? toMoment(value).format('DD-MM-YYYY') : ''}
                                readOnly
                            />
                            <Icon icon='IcCalendar' className='icon-datepicker' />
                            <CSSTransition
                                in={this.state.should_show_calendar}
                                timeout={100}
                                classNames={{
                                    enter: 'datepicker__picker--enter datepicker__picker--bottom-enter',
                                    enterDone: 'datepicker__picker--enter-done datepicker__picker--bottom-enter-done',
                                    exit: 'datepicker__picker--exit datepicker__picker--bottom-exit',
                                }}
                                unmountOnExit
                            >
                                <div className='datepicker__picker' ref={this.reference}>
                                    <DatePickerCalendar
                                        max_date={this.state.max_date}
                                        min_date={this.state.min_date}
                                        date={this.state.date}
                                        onChange={(val, type) => {
                                            setFieldValue(name, val, true);
                                            if (type === 'day') {
                                                this.closeDatePicker();
                                            }
                                        }}
                                        value={value}
                                    />
                                </div>
                            </CSSTransition>
                        </DesktopWrapper>
                        <MobileWrapper>
                            {/* TODO: Move native date-picker to deriv components */}
                            <div
                                className={classNames('dc-input', {
                                    'dc-input--error': touched[name] && errors[name],
                                })}
                            >
                                <div className='datepicker__display'>
                                    {value && (
                                        <span className='datepicker__display-text'>
                                            {toMoment(value).format('DD-MM-YYYY')}
                                        </span>
                                    )}
                                </div>
                                <label
                                    className={classNames('datepicker__placeholder', {
                                        'datepicker__placeholder--has-value': !!value,
                                        'datepicker__placeholder--has-error': touched[name] && errors[name],
                                    })}
                                    htmlFor={this.props.id}
                                >
                                    {localize('Date of birth*')}
                                </label>
                                <Icon icon='IcCalendar' className='datepicker__calendar-icon' />
                                <input
                                    id={this.props.id}
                                    name={name}
                                    className='datepicker__native'
                                    type='date'
                                    max={this.state.max_date}
                                    min={this.state.min_date}
                                    onBlur={handleBlur}
                                    defaultValue={toMoment(this.state.max_date).format('YYYY-MM-DD')}
                                    error={touched[name] && errors[name]}
                                    required
                                    onFocus={e => {
                                        setFieldValue(
                                            name,
                                            e.target.value ? toMoment(e.target.value).format('YYYY-MM-DD') : null,
                                            true
                                        );
                                    }}
                                    onChange={e => {
                                        // fix for ios issue: clear button doesn't work
                                        // https://github.com/facebook/react/issues/8938
                                        const target = e.nativeEvent.target;
                                        function iosClearDefault() {
                                            target.defaultValue = '';
                                        }
                                        window.setTimeout(iosClearDefault, 0);
                                        setFieldValue(
                                            name,
                                            e.target.value ? toMoment(e.target.value).format('YYYY-MM-DD') : null,
                                            true
                                        );
                                    }}
                                />
                                {touched[name] && errors[name] && (
                                    <span className='datepicker__error'>{localize('Date of birth is required')}</span>
                                )}
                            </div>
                        </MobileWrapper>
                    </div>
                )}
            />
        );
    }
}

const InputField = props => {
    return (
        <Field name={props.name}>
            {({ field, form: { errors, touched } }) => (
                <React.Fragment>
                    <Input
                        type='text'
                        required
                        autoComplete='off'
                        maxLength='30'
                        error={touched[field.name] && errors[field.name]}
                        {...field}
                        {...props}
                    />
                </React.Fragment>
            )}
        </Field>
    );
};

class PersonalDetails extends React.Component {
    constructor(props) {
        super(props);
        this.form = React.createRef();
        this.state = {
            // add padding-bottom to the form when datepicker is active
            // to add empty spaces at the bottom when scrolling
            paddingBottom: 'unset',
        };
    }

    componentDidMount() {
        this.form.current.getFormikActions().validateForm();
    }

    handleCancel = values => {
        this.props.onSave(this.props.index, values);
        this.props.onCancel();
    };

    onFocus = is_active => {
        this.setState({ paddingBottom: is_active ? '18rem' : 'unset' });
    };

    render() {
        return (
            <Formik
                initialValues={{ ...this.props.value }}
                validate={this.props.validate}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(this.props.index, values, actions.setSubmitting);
                }}
                ref={this.form}
            >
                {({ handleSubmit, isSubmitting, errors, setFieldValue, touched, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Div100vhContainer className='details-form' height_offset='199px' is_disabled={isDesktop()}>
                            <p className='details-form__description'>
                                <Localize
                                    i18n_default_text={
                                        'Any information you provide is confidential and will be used for verification purposes only.'
                                    }
                                />
                            </p>
                            <div className='details-form__elements-container'>
                                <ThemedScrollbars
                                    is_native={isMobile()}
                                    autoHide
                                    style={{
                                        height: 'calc(100% - 16px)',
                                    }}
                                >
                                    <div
                                        className='details-form__elements'
                                        style={{ paddingBottom: this.state.paddingBottom }}
                                    >
                                        {/* Remmove account opening reason once api is optional */}
                                        {'account_opening_reason' in this.props.value && (
                                            <Field name='account_opening_reason'>
                                                {({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        data-lpignore='true'
                                                        autoComplete='new-password' // prevent chrome autocomplete
                                                        type='text'
                                                        label={localize('Account opening reason*')}
                                                        error={
                                                            touched.account_opening_reason &&
                                                            errors.account_opening_reason
                                                        }
                                                        // disabled={this.props.value.account_opening_reason}
                                                        list_items={this.props.account_opening_reason_list}
                                                        onItemSelection={value =>
                                                            setFieldValue('account_opening_reason', value, true)
                                                        }
                                                        required
                                                    />
                                                )}
                                            </Field>
                                        )}
                                        {/* Remove salutation once api is optional */}
                                        {'salutation' in this.props.value && (
                                            <Field name='salutation'>
                                                {({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        data-lpignore='true'
                                                        autoComplete='new-password' // prevent chrome autocomplete
                                                        type='text'
                                                        label={localize('Title*')}
                                                        error={touched.salutation && errors.salutation}
                                                        // disabled={this.props.value.salutation}
                                                        list_items={this.props.salutation_list}
                                                        onItemSelection={value =>
                                                            setFieldValue('salutation', value, true)
                                                        }
                                                        required
                                                    />
                                                )}
                                            </Field>
                                        )}
                                        <InputField
                                            name='first_name'
                                            label={localize('First name*')}
                                            placeholder={localize('John')}
                                        />
                                        <InputField
                                            name='last_name'
                                            label={localize('Last name*')}
                                            placeholder={localize('Doe')}
                                        />
                                        <DateOfBirth
                                            name='date_of_birth'
                                            label={localize('Date of birth*')}
                                            placeholder={localize('01-07-1999')}
                                            onFocus={this.onFocus}
                                        />
                                        {'place_of_birth' in this.props.value && (
                                            <Field name='place_of_birth'>
                                                {({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        data-lpignore='true'
                                                        autoComplete='new-password' // prevent chrome autocomplete
                                                        type='text'
                                                        label={localize('Place of birth*')}
                                                        error={touched.place_of_birth && errors.place_of_birth}
                                                        // disabled={this.props.value.place_of_birth}
                                                        list_items={this.props.residence_list}
                                                        onItemSelection={({ value, text }) =>
                                                            setFieldValue('place_of_birth', value ? text : '', true)
                                                        }
                                                        required
                                                    />
                                                )}
                                            </Field>
                                        )}
                                        {'citizen' in this.props.value && (
                                            <Field name='citizen'>
                                                {({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        data-lpignore='true'
                                                        autoComplete='new-password' // prevent chrome autocomplete
                                                        type='text'
                                                        label={localize('Citizenship*')}
                                                        error={touched.citizen && errors.citizen}
                                                        disabled={
                                                            this.props.value.citizen &&
                                                            this.props.is_fully_authenticated
                                                        }
                                                        list_items={this.props.residence_list}
                                                        onItemSelection={({ value, text }) =>
                                                            setFieldValue('citizen', value ? text : '', true)
                                                        }
                                                        required
                                                    />
                                                )}
                                            </Field>
                                        )}
                                        <InputField
                                            name='phone'
                                            label={localize('Phone number*')}
                                            placeholder={localize('Phone number')}
                                        />
                                    </div>
                                </ThemedScrollbars>
                            </div>
                        </Div100vhContainer>
                        <FormSubmitButton
                            is_absolute
                            cancel_label={localize('Previous')}
                            has_cancel
                            is_disabled={
                                // eslint-disable-next-line no-unused-vars
                                isSubmitting || Object.keys(errors).length > 0
                            }
                            label={localize('Next')}
                            onCancel={this.handleCancel.bind(this, values)}
                        />
                    </form>
                )}
            </Formik>
        );
    }

    validatePersonalDetails = landing_company => this.props.validate;
}

export default PersonalDetails;
