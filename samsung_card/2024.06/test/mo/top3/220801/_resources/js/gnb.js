window.addEventListener('DOMContentLoaded', ()=>{

    const gnb_source_arr = [
        'QAMBMBS11T', // 이벤트
        'QAMBMBS120', // 추천카드
        'QAMBMBS12T', // 쇼핑
        'QAMBMBS16T', // 프리미엄
        'QAMBMBS13T', // 주유·충전
        'QAMBMBS14T', // 마일리지·여행
        'QAMBMBS15T', // 개인사업자
    ];
    
    let gnb_source_types;

    if (query_json.site == "QAKWAMB05" || query_json.site == "QCKWAMB05") {
        gnb_source_types = Array(gnb_source_arr.length).fill(query_json.site);
    } else {
        gnb_source_types = [...gnb_source_arr]
    }

    const gnb_info_arr = [
        {
            name: '이벤트',
            urlName: 'm0',
            herf: './m00.html?',
            param: [
                utm_param,
                card_detail_qs
            ]
        },
        {
            name: '추천카드',
            urlName: 'm1',
            herf: './m01.html?',
            param: [
                utm_param,
                card_detail_qs
            ]
        },
        {
            name: '쇼핑',
            urlName: 'm2',
            herf: './m02.html?',
            param: [
                utm_param,
                card_detail_qs
            ]
        },
        {
            name: '프리미엄',
            urlName: 'm5',
            herf: './m05.html?',
            param: [
                utm_param,
                card_detail_qs
            ]
        },
        {
            name: '주유 충전',
            urlName: 'm3',
            herf: './m03.html?',
            param: [
                utm_param,
                card_detail_qs
            ]
        },
        {
            name: '마일리지 여행',
            urlName: 'm6',
            herf: './m06.html?',
            param: [
                utm_param,
                card_detail_qs
            ]
        },
        {
            name: '개인사업자',
            urlName: 'm4',
            herf: './m04.html?',
            param: [
                utm_param,
                card_detail_qs
            ]
        },
    ]

    const $gnbPannel = $('.gnb_pannel')

    $gnbPannel.html(`
        <div class="gnb_area">
            <div class="gnb_list">
            </div>
        </div>
    `);

    gnb_info_arr.forEach((t,i)=>{
        if (t.param){
            t.param.forEach(param=>t.herf += param)
        }

        $('.gnb_list').append(`
            <a href="${t.herf}" class="gnb_link">
                <img class="off" src="../_resources/images/com/gnb/off/${t.urlName}.png" alt=""/>
                <img class="on" src="../_resources/images/com/gnb/on/${t.urlName}.png" alt=""/>
            </a>
        `);

    })
    
    const gnbIdx = $gnbPannel.attr('data-active-index')
    $gnbPannel.find('.gnb_link').eq(Number(gnbIdx)).addClass('active');
    
    $('.gnb_area .gnb_link').on('click',(e)=>{
        $(e.currentTarget).addClass('active').siblings('').removeClass('active');
    });
    
    // gsap.registerPlugin(ScrollTrigger);
    // ScrollTrigger.create({
    //     trigger: '.gnb_area',
    //     start: 'top top',
    //     endTrigger:'#wrap',
    //     end: 'bottom bottom',
    //     pin: true,
    //     pinSpacing: false,
    // });
    
});