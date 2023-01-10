import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import classNames from 'classnames';
import React from 'react';
import Cards from './cards';
import InfoPanel from './info-panel';
import Local from './load-bot-preview/local';
import UserGuide from './user-guide';
import SaveModal from 'Components/save-modal';

type TDashboard = {
    is_info_panel_visible: boolean;
    dashboard_strategies: [];
    has_started_onboarding_tour: boolean;
    setActiveTab: (param: number) => void;
};

type TDashboardMobileCommonProps = {
    is_mobile: boolean;
    has_dashboard_strategies: boolean;
};

const DashboardTitle = ({ is_mobile, has_dashboard_strategies }: TDashboardMobileCommonProps) => (
    <div
        className={classNames('tab__dashboard__header', {
            'tab__dashboard__header--not-listed': !has_dashboard_strategies && is_mobile,
        })}
    >
        <Text color='prominent' line_height='xxl' size={is_mobile ? 's' : 'm'} weight='bold'>
            {localize('Load or build your bot')}
        </Text>
    </div>
);

const MobileIconGuide = ({ has_dashboard_strategies }: { has_dashboard_strategies: boolean }) => (
    <MobileWrapper>
        <div>
            <Local />
        </div>
    </MobileWrapper>
);

const DashboardDescription = ({ is_mobile, has_dashboard_strategies }: TDashboardMobileCommonProps) => (
    <div
        className={classNames('tab__dashboard__description', {
            'tab__dashboard__description__loaded--listed': has_dashboard_strategies && !is_mobile,
            'tab__dashboard__description__loaded--not-listed':
                !has_dashboard_strategies || (!has_dashboard_strategies && is_mobile),
        })}
    >
        <Text color='prominent' line_height='s' size={is_mobile ? 'xxs' : 's'}>
            {localize(
                'Import bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
            )}
        </Text>
    </div>
);

const DashboardComponent = ({
    is_info_panel_visible,
    dashboard_strategies,
    has_started_onboarding_tour,
    setActiveTab,
}: TDashboard) => {
    const has_dashboard_strategies = !!dashboard_strategies?.length;
    const is_mobile = isMobile();
    return (
        <React.Fragment>
            <div
                className={classNames('tab__dashboard', {
                    'tab__dashboard--tour-active': has_started_onboarding_tour && !is_mobile,
                })}
            >
                <div className='tab__dashboard__content'>
                    <div
                        className={classNames('tab__dashboard__centered', {
                            'tab__dashboard__centered--listed': !is_mobile && has_dashboard_strategies,
                            'tab__dashboard__centered--not-listed': !has_dashboard_strategies,
                        })}
                    >
                        {!has_dashboard_strategies && !is_mobile && (
                            <DashboardTitle is_mobile={is_mobile} has_dashboard_strategies={has_dashboard_strategies} />
                        )}
                        <DesktopWrapper>
                            {!has_dashboard_strategies && <UserGuide setActiveTab={setActiveTab} />}
                        </DesktopWrapper>
                        <div>
                            <div
                                className={classNames({
                                    'tab__dashboard__mobile-container': is_mobile,
                                    'tab__dashboard__mobile-container--minimized':
                                        is_mobile && has_dashboard_strategies,
                                })}
                            >
                                {is_mobile && !has_dashboard_strategies && (
                                    <DashboardTitle
                                        is_mobile={is_mobile}
                                        has_dashboard_strategies={has_dashboard_strategies}
                                    />
                                )}
                                {(!is_mobile || (is_mobile && has_dashboard_strategies)) && (
                                    <DashboardDescription
                                        is_mobile={is_mobile}
                                        has_dashboard_strategies={has_dashboard_strategies}
                                    />
                                )}
                                <MobileIconGuide has_dashboard_strategies={has_dashboard_strategies} />
                            </div>
                            {is_mobile && !has_dashboard_strategies && (
                                <DashboardDescription
                                    is_mobile={is_mobile}
                                    has_dashboard_strategies={has_dashboard_strategies}
                                />
                            )}
                        </div>
                        <Cards has_dashboard_strategies={has_dashboard_strategies} is_mobile={is_mobile} />
                    </div>

                    {has_dashboard_strategies && !is_mobile && (
                        <div className='tab__dashboard__preview'>
                            <Local />
                        </div>
                    )}
                </div>
            </div>
            <DesktopWrapper>
                {!has_started_onboarding_tour && (
                    <div
                        className={classNames('tab__dashboard__info-panel', {
                            'tab__dashboard__info-panel--active': is_info_panel_visible,
                        })}
                    >
                        <InfoPanel />
                    </div>
                )}
            </DesktopWrapper>
            <MobileWrapper>
                <SaveModal />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default connect(({ dashboard, load_modal }: RootStore) => ({
    is_info_panel_visible: dashboard.is_info_panel_visible,
    dashboard_strategies: load_modal.dashboard_strategies,
    setActiveTab: dashboard.setActiveTab,
    has_started_onboarding_tour: dashboard.has_started_onboarding_tour,
}))(DashboardComponent);
