define([], function(undefined){
    var _mapping = {
        viewToData:{
            AFFILIATIONS:{control:'btnAffiliations',
                intDataIndex:'0',
                data:'affiliations.xml',
                tagsXml:['affiliations', 'affiliation'],
                tagsXmlChildsCommon:['affiliationName'],
                modelCid:'affiliationsId',
                templateId:'templateAffiliations'},
            BOARD:{control:'btnBoardMembers',
                intDataIndex:'1',
                data:'board.xml',
                tagsXml:['page', 'member'],
                tagsXmlChildsCommon:['positionTitle', 'names', 'name', 'phone', 'email'],
                modelCid:'boardId',
                templateId:'templateBoardMembers'},
            BOOKSALE:{control:'btnBookSale',
                intDataIndex:'2',
                data:'bookSale.xml?version=1.2',
                tagsXml:['page', 'member'],
                tagsXmlChildsCommon:['link', 'h10', 'paragraph0', 'paragraph1', 'booksaleImage', 'booksaleImage1', 'booksaleImage2', 'recipient1', 'recipient2', 'recipient3', 'recipient4', 'recipient5', 'recipient6', 'recipient7'],
                modelCid:'bookSaleId',
                templateId:'templateBooksale'},
            CONTACT_US:{control:'btnContactUs',
                intDataIndex:'3',
                data:'contactUs.xml',
                tagsXml:['informations', 'information'],
                tagsXmlChildsCommon:['headerTextRightSide', 'namePresident', 'positionPresident'],
                modelCid:'contactUsId',
                templateId:'templateContactUs'},
            EVENTS:{control:'btnEventsIsNotUsed',
                intDataIndex:'5',
                data:'events.xml',
                tagsXml:['members', 'member'],
                tagsXmlChildsCommon:['heading', 'text'],
                modelCid:'eventsId',
                templateId:'templateEvents'},
            HOME:{control:'btnHome',
                intDataIndex:'5',
                data:'home.xml',
                tagsXml:['paragraphs', 'paragraph'],
                tagsXmlChildsCommon:['heading', 'content'],
                modelCid:'homeId',
                templateId:'templateHome'},
            INTEREST_GROUPS:{control:'btnInterestGroups',
                intDataIndex:'6',
                data:'interestGroups.xml',
                tagsXml:['groups', 'group'],
                tagsXmlChildsCommon:['paragraph0','name', 'dateTime', 'contactPerson', 'contactPersonSecond'],
                modelCid:'interestGroupsId',
                templateId:'templateInterestGroups'},
            MEETINGS:{control:'btnMeetings',
                intDataIndex:'7',
                data:'meetings.xml',
                tagsXml:['meetings', 'meeting'],
                tagsXmlChildsCommon:['titleNode','dateNode', 'timeNode', 'info', 'location', 'otherInfo'],
                modelCid:'meetingsId',
                templateId:'templateMeetings'},
            MEMBERSHIP_APPLICATION:{control:'btnMembershipApplication',
                intDataIndex:'8',
                data:'membershipApplication.xml',
                tagsXml:['links', 'link'],
                tagsXmlChildsCommon:['pdf', 'word'],
                modelCid:'membershipApplicationId',
                templateId:'templateMembershipApplication'},
            MISSION_STATEMENT:{control:'btnMissionStatement',
                intDataIndex:'9',
                data:'missionStatement.xml',
                tagsXml:['paragraphs', 'paragraph'],
                tagsXmlChildsCommon:['heading', 'text'],
                modelCid:'missionStatementId',
                templateId:'templateMissionStatement'},
            NEWS:{control:'btnNews',
                intDataIndex:'10',
                data:'news.xml',
                tagsXml:['newsletters', 'newsletter'],
                tagsXmlChildsCommon:['pdf', 'word'],
                modelCid:'newsId',
                templateId:'templateNews'},
            SCHOLARSHIPS:{control:'btnScholarships',
                intDataIndex:'11',
                data:'scholarships.xml',
                tagsXml:['sections', 'section'],
                tagsXmlChildsCommon:['paragraph0', 'paragraph1', 'paragraph2', 'paragraph3', 'paragraph4', 'paragraph5', 'paragraph6',
                'paragraph7', 'paragraph8', 'paragraph9', 'paragraph10', 'paragraph11'],
                modelCid:'scholarshipsId',
                templateId:'templateScholarships'},
            BADGE:{control:'btnBadge',
                intDataIndex:'12',
                data:'badge.xml',
                tagsXml:['sections', 'section', 'events'],
                tagsXmlChildsCommon:['paragraph0', 'paragraph1', 'paragraph2', 'paragraph3', 'textNode', 'heading',
                'lineItem0', 'lineItem1', 'lineItem2', 'paragraph4', 'subHeading1', 'subHeading2', 'link0', 'event'],
                modelCid:'badgeId',
                templateId:'templateBadge'}
        }
    };

    return{
        mapping:_mapping
    }

}); // End define([] ...
