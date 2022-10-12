import classnames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RecentWorkspace from './recent-workspace';
import RootStore from 'Stores/index';
import SaveModal from './save-modal';
import DeleteDialog from './delete-dialog';
import { getSavedWorkspaces } from '@deriv/bot-skeleton';

type TRecentComponent = {
    is_explanation_expand: boolean;
    recent_strategies: [];
    toggleExplanationExpand: boolean;
    is_strategy_removed: boolean;
    handleFileChange: () => void;
    toggleStrategies: (param: boolean) => void;
    setRecentStrategies: () => void;
};

const RecentComponent = ({
    is_explanation_expand,
    recent_strategies,
    toggleExplanationExpand,
    toggleStrategies,
    is_strategy_removed,
    setRecentStrategies,
}: TRecentComponent) => {
    const [getdata, setGetdata] = React.useState([recent_strategies]);

    React.useEffect(() => {
        toggleStrategies(true);
        getSavedWorkspaces().then(data => {
            setGetdata(data);
        });
    }, []);

    if (getdata?.length) {
        return (
            <div className='load-strategy__container load-strategy__container--has-footer'>
                <div className='load-strategy__recent'>
                    <div
                        className='load-strategy__recent-files'
                        style={{
                            flexBasis: '100%',
                        }}
                    >
                        <div className='load-strategy__title'>
                            <Localize i18n_default_text='Your Bots' />
                        </div>
                        <div className='load-strategy__recent-files-list'>
                            <div
                                style={{
                                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                                    height: 'auto',
                                    padding: '0.8rem',
                                }}
                            >
                                <strong>Bot name</strong>
                                <strong>Bot name</strong>
                                <strong>Bot name</strong>
                                <strong>Bot name</strong>
                            </div>
                            {recent_strategies.map((workspace, index) => (
                                <RecentWorkspace key={workspace.id} workspace={workspace} index={index} />
                            ))}
                        </div>
                        <SaveModal />
                        <DeleteDialog />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='load-strategy__container'>
            <div className='load-strategy__recent-empty'>
                <Icon icon='IcEmptyFolder' className='load-strategy__recent-empty-icon' size={128} />
                <div className='load-strategy__recent-empty-title'>
                    <Localize i18n_default_text='You do not have any recent bots' />
                </div>
                <div className='load-strategy__recent-empty-description'>
                    <Localize i18n_default_text='Create one or upload one from your local drive or Google Drive.' />
                </div>
                <div className='load-strategy__recent-empty-expand' onClick={toggleExplanationExpand}>
                    <Localize i18n_default_text="Why can't I see my recent bots?" />
                </div>
                <div
                    className={classnames('load-strategy__recent-empty-explanation', {
                        'load-strategy__recent-empty-explanation--show': is_explanation_expand,
                    })}
                >
                    <div>
                        <Localize i18n_default_text="If you've recently used bots but don't see them in this list, it may be because you:" />
                    </div>
                    <ol className='load-strategy__recent-empty-explanation-list'>
                        <li>
                            <Localize i18n_default_text='1. Logged in from a different device' />
                        </li>
                        <li>
                            <Localize i18n_default_text='2. Logged in from a different browser' />
                        </li>
                        <li>
                            <Localize i18n_default_text='3. Cleared your browser cache' />
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

const Recent = connect(({ load_modal }: RootStore) => ({
    is_explanation_expand: load_modal.is_explanation_expand,
    recent_strategies: load_modal.recent_strategies,
    handleFileChange: load_modal.handleFileChange,
    toggleExplanationExpand: load_modal.toggleExplanationExpand,
    onEntered: load_modal.onEntered,
    load_recent_strategies: load_modal.load_recent_strategies,
    toggleStrategies: load_modal.toggleStrategies,
    is_strategy_removed: load_modal.is_strategy_removed,
    setRecentStrategies: load_modal.setRecentStrategies,
}))(RecentComponent);

export default Recent;
