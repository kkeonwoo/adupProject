window.addEventListener('DOMContentLoaded', ()=>{

    const gnb_source_arr = [
        'QAMBPCS11T', // 이벤트
        'QAMBPCS120', // 추천카드
        'QAMBPCS12T', // 쇼핑
        'QAMBPCS16T', // 프리미엄
        'QAMBPCS13T', // 주유·충전
        'QAMBPCS14T', // 마일리지·여행
        'QAMBPCS15T', // 개인사업자
    ];
    
    let gnb_source_types;

    if (query_json.site == "QAKWAPCB05" || query_json.site == "QCKWAPCB05") {
        gnb_source_types = Array(gnb_source_arr.length).fill(query_json.site);
    } else if (query_json.affcode == "QAKWAPCB05" || query_json.affcode == "QCKWAPCB05") {
        gnb_source_types = Array(gnb_source_arr.length).fill(query_json.affcode);
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
        t.herf += `alncmpC=${gnb_source_types[i]}&affcode=${gnb_source_types[i]}`

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