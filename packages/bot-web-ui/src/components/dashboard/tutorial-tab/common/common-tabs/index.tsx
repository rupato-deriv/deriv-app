import React from 'react';
import { Localize } from '@deriv/translations';
import FAQContent from '../../faq-content';
import GuideContent from '../../guide-content';
import NoSearchResult from '../no-search-result-found';

export const GuideTab = ({ guideList }) => <GuideContent guide_list={guideList} />;

export const FAQTab = ({ faqList, isMobile }) => <FAQContent faq_list={faqList} hide_header={isMobile} />;

export const SearchTab = ({ filteredList, guideList, faqList, isMobile, search }) =>
    filteredList.length > 0 ? (
        <>
            {guideList.length > 0 && <GuideTab guideList={guideList} />}
            {faqList.length > 0 && <FAQTab faqList={faqList} isMobile={isMobile} />}
        </>
    ) : (
        <NoSearchResult />
    );

export const generateTutorialTabs = (sidebar_content, is_mobile, search) => {
    const { guide_tab_content, faq_tab_content, filtered_tab_list } = sidebar_content;

    const tutorial_tabs = [
        { label: <Localize i18n_default_text='Guide' />, content: <GuideTab guideList={guide_tab_content} /> },
        {
            label: <Localize i18n_default_text='FAQ' />,
            content: <FAQTab faqList={faq_tab_content} isMobile={is_mobile} />,
        },
        {
            label: <Localize i18n_default_text='Search' />,
            content: (
                <SearchTab
                    filteredList={filtered_tab_list}
                    guideList={guide_tab_content}
                    faqList={faq_tab_content}
                    isMobile={is_mobile}
                    search={search}
                />
            ),
        },
    ];

    return tutorial_tabs;
};
