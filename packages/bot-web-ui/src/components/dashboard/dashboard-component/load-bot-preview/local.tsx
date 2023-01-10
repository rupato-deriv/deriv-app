import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { Text, Icon, DesktopWrapper, MobileWrapper, Dialog } from '@deriv/components';
import { connect } from 'Stores/connect';
import LocalFooter from './local-footer';
import classNames from 'classnames';
import WorkspaceControl from './workspace-control';
import RootStore from 'Stores/index';
import './index.scss';
import { isMobile } from '@deriv/shared';
import BotPreview from './bot-preview';

type TWorkspace = {
    id: string;
    xml: string;
    name: string;
    timestamp: number;
    save_type: string;
};

type Nullable<T> = T | null;
type TLocalComponent = {
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, data: boolean) => boolean;
    loaded_local_file: boolean;
    loadFileFromLocal: () => void;
    loadFileFromRecent: () => void;
    onConfirmSave: () => void;
    onDrop: () => void;
    previewRecentStrategy: () => void;
    setActiveTab: (param: number) => void;
    dashboard_strategies: Array<TWorkspace>;
    setFileLoaded: (param: boolean) => void;
    setLoadedLocalFile: (data: Nullable<string>) => void;
    setTourDialogVisibility: (param: boolean) => boolean;
    setPreviewOnDialog: (param: boolean) => boolean;
    has_mobile_preview_loaded: boolean;
};

const LocalComponent = ({
    handleFileChange,
    loaded_local_file,
    loadFileFromLocal,
    loadFileFromRecent,
    onConfirmSave,
    setActiveTab,
    dashboard_strategies,
    setPreviewOnDialog,
    has_mobile_preview_loaded,
}: TLocalComponent) => {
    const file_input_ref = React.useRef<HTMLInputElement | null>(null);
    const [setIsFileSupported] = React.useState<boolean>(true);
    const loadedLocalFileLocation = () => {
        return loaded_local_file ? loadFileFromLocal() : loadFileFromRecent();
    };
    const el_ref = React.useRef<HTMLInputElement | null>(null);
    React.useEffect(() => {
        if (el_ref.current?.children.length === 3) {
            el_ref?.current?.removeChild(el_ref?.current?.children[1]);
        }
    }, [el_ref.current?.children.length]);
    const clearInjectionDiv = () => {
        el_ref?.current?.removeChild(el_ref?.current?.children[0]);
    };
    const is_mobile = isMobile();
    const has_dashboard_strategies = !!dashboard_strategies?.length;

    return (
        <div className='load-strategy__container load-strategy__container--has-footer'>
            <div
                className={classNames('load-strategy__local-preview', {
                    'load-strategy__local-preview--listed': has_dashboard_strategies,
                })}
            >
                <div className='load-strategy__recent-preview'>
                    <div
                        className={classNames('load-strategy__title', 'load-strategy__recent-preview-title', {
                            'load-strategy__title--listed': has_dashboard_strategies && is_mobile,
                        })}
                    >
                        {!is_mobile && <Localize i18n_default_text='Preview' />}
                        <div className='tab__dashboard__preview__retrigger'>
                            <button
                                onClick={() => {
                                    setActiveTab(4);
                                }}
                            >
                                <Icon
                                    className='tab__dashboard__preview__retrigger__icon'
                                    width='2.4rem'
                                    height='2.4rem'
                                    icon={'IcDbotUserGuide'}
                                />
                                {!is_mobile && (
                                    <Text
                                        color='prominent'
                                        size='xs'
                                        line_height='s'
                                        className={'tab__dashboard__preview__retrigger__text'}
                                    >
                                        {localize('User Guide')}
                                    </Text>
                                )}
                            </button>
                        </div>
                    </div>

                    {!is_mobile && (
                        <>
                            <div className='load-strategy__preview-workspace'>
                                <BotPreview id_ref={el_ref} type={'local'} />
                            </div>
                            <div className='load-strategy__button-group'>
                                <input
                                    type='file'
                                    ref={file_input_ref}
                                    accept='.xml'
                                    style={{ display: 'none' }}
                                    onChange={e => {
                                        clearInjectionDiv();
                                        onConfirmSave();
                                        setIsFileSupported(handleFileChange(e, false));
                                    }}
                                />
                                <button
                                    className='load-strategy__button-group--open'
                                    onClick={() => {
                                        loadFileFromRecent();
                                        setActiveTab(1);
                                    }}
                                >
                                    {localize('Open')}
                                </button>
                            </div>
                        </>
                    )}
                    <MobileWrapper>
                        <Dialog
                            is_visible={has_mobile_preview_loaded}
                            onCancel={() => setPreviewOnDialog(false)}
                            is_mobile_full_width
                            className={'dc-dialog__wrapper--preview'}
                            has_close_icon
                            title={localize('Preview')}
                        >
                            <BotPreview id_ref={el_ref} type={'local'} />
                            <div className='load-strategy__button-group'>
                                <button
                                    className='load-strategy__button-group--open'
                                    onClick={() => {
                                        loadFileFromRecent();
                                        setActiveTab(1);
                                    }}
                                >
                                    {localize('Open')}
                                </button>
                            </div>
                        </Dialog>
                    </MobileWrapper>
                </div>
            </div>
        </div>
    );
};

const Local = connect(({ load_modal, save_modal, dashboard }: RootStore) => ({
    handleFileChange: load_modal.handleFileChange,
    is_open_button_loading: load_modal.is_open_button_loading,
    loaded_local_file: load_modal.loaded_local_file,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
    dashboard_strategies: load_modal.dashboard_strategies,
    onConfirmSave: save_modal.onConfirmSave,
    setActiveTab: dashboard.setActiveTab,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    loadFileFromRecent: load_modal.loadFileFromRecent,
    setFileLoaded: dashboard.setFileLoaded,
    setPreviewOnDialog: dashboard.setPreviewOnDialog,
    has_mobile_preview_loaded: dashboard.has_mobile_preview_loaded,
}))(LocalComponent);

export default Local;
