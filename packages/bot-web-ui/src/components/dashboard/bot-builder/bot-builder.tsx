import React from 'react';
import RootStore from 'Stores/index';
import AppStore from 'Stores/app-store';
import { connect } from 'Stores/connect';
import ReactJoyride from 'react-joyride';
import classNames from 'classnames';
import LoadModal from 'Components/load-modal';
import WorkspaceWrapper from './workspace-wrapper';
import { BOT_BUILDER_TOUR, handleJoyrideCallback } from '../joyride-config';

type TBotBuilder = {
    app: AppStore;
    active_tab: number;
    has_started_onboarding_tour: boolean;
    is_preview_on_popup: boolean;
    setOnBoardTourRunState: (has_started_onboarding_tour: boolean) => boolean;
    has_started_bot_builder_tour: boolean;
};

const BotBuilder = ({
    app,
    active_tab,
    has_started_onboarding_tour,
    is_preview_on_popup,
    has_started_bot_builder_tour,
}: TBotBuilder) => {
    const [is_tour_running] = React.useState<boolean>(true);
    const { onMount, onUnmount } = app;

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, []);

    return (
        <div
            className={classNames('bot-builder', {
                'bot-builder--active': active_tab === 1 && !is_preview_on_popup,
                'bot-builder--inactive': is_preview_on_popup,
            })}
        >
            {is_preview_on_popup ? null : (
                <div
                    id='scratch_div'
                    style={{
                        width: 'calc(100vw - 3.2rem)',
                        height: 'var(--bot-content-height)',
                    }}
                >
                    <WorkspaceWrapper />
                    {has_started_bot_builder_tour && active_tab === 1 && !has_started_onboarding_tour && (
                        <ReactJoyride
                            steps={BOT_BUILDER_TOUR}
                            run={is_tour_running}
                            continuous
                            showProgress
                            callback={handleJoyrideCallback}
                            locale={{ back: 'Previous' }}
                            styles={{
                                options: {
                                    arrowColor: 'var(--general-main-2)',
                                    backgroundColor: 'var(--general-main-2)',
                                    primaryColor: 'var(--brand-red-coral)',
                                    textColor: 'var(--text-general)',
                                    spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
                                },
                                buttonBack: {
                                    border: '0.1rem solid var(--text-less-prominent)',
                                    marginRight: '1rem',
                                    borderRadius: '0.4rem',
                                    color: 'var(--text-general)',
                                    padding: '0.6rem',
                                },
                                tooltipContent: {
                                    padding: '0 1rem',
                                },
                            }}
                        />
                    )}
                </div>
            )}
            {/* removed this outside from toolbar becuase it needs to loaded seperately without dependency */}
            <LoadModal />
        </div>
    );
};

export default connect(({ app, dashboard }: RootStore) => ({
    app,
    active_tab: dashboard.active_tab,
    has_started_onboarding_tour: dashboard.has_started_onboarding_tour,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    is_preview_on_popup: dashboard.is_preview_on_popup,
    has_started_bot_builder_tour: dashboard.has_started_bot_builder_tour,
}))(BotBuilder);
