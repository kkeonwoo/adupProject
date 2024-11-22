include = {
    header: function() {
        const temp = `
            <div class="hdr_inner">
                <button type="button" class="chat_btn" aria-label="chat button"></button>
                <h1 class="logo">
                    <a href="http://file.adup.kr/LAMICHE/contents/index.html" class="logo_link">
                        <span class="blind">LAMICHE LOGO</span>
                    </a>
                </h1>
                <button type="button" class="more_btn" aria-label="GNB more button"></button>
            </div>
            <div class="hdr_cnt_area">
                <div class="sns_box">
                    <span class="txt">CLUBMIZ LAMICHE SNS</span>
                    <ul class="sns_list">
                        <li class="sns_item">
                            <a href="#" class="sns fb" aria-label="sns facebook"></a>
                        </li>
                        <li class="sns_item">
                            <a href="#" class="sns ig" aria-label="sns instagram"></a>
                        </li>
                        <li class="sns_item">
                            <a href="#" class="sns yt" aria-label="sns youtube"></a>
                        </li>
                    </ul>
                </div>
                <div class="depth_area">
                    <ul class="depth_list">
                        <li class="depth_item">
                            <a href="http://file.adup.kr/LAMICHE/contents/intro.html" class="depth_link">шилдэг сонголт, Рамиче</a>
                        </li>
                        <li class="depth_item">
                            <a href="http://file.adup.kr/LAMICHE/contents/info/medical-staff.html" class="depth_link">шилдэг сонголт, Рамиче</a>
                        </li>
                        <li class="depth_item">
                            <a href="http://file.adup.kr/LAMICHE/contents/info/history.html" class="depth_link">Эмнэлгийн ажилтнуудын танилцуулга</a>
                        </li>
                        <li class="depth_item">
                            <a href="http://file.adup.kr/LAMICHE/contents/info/hospital-tour.html" class="depth_link">Эмнэлэгтэй танилцах</a>
                        </li>
                        <li class="depth_item">
                            <a href="http://file.adup.kr/LAMICHE/contents/info/medical-system.html" class="depth_link">Эмчилгээний систем</a>
                        </li>
                    </ul>
                </div>
            </div>
        `;
        $("#header").html(temp);
    },
    footer: function() {
        const temp = `
            <div class="google_map_area">
                <b class="ttl">Эмнэлэгт ирэх арга</b>
                <div class="map_box">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12659.60175241408!2d127.080452!3d37.5102663!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca44d749b1265%3A0x79ea8ce178befc27!2z7YG065-966-47KaI652866-47LK07J2Y7JuQIOyeoOyLpA!5e0!3m2!1sko!2skr!4v1732001830364!5m2!1sko!2skr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <address class="adrs">
                    Сөүл Сунпа дүүрэг пэкжэ губүн-ро 7гил 14 Тэвон барилга 5, 6, 7 давхарт Чамшил <br/>
                    Сэнэ метроны буудлын 4-р гарц / Спорт цогцолбор метроны буудлын 9-р гарц
                </address>
                <a href="https://www.google.com/maps/place/%ED%81%B4%EB%9F%BD%EB%AF%B8%EC%A6%88%EB%9D%BC%EB%AF%B8%EC%B2%B4%EC%9D%98%EC%9B%90+%EC%9E%A0%EC%8B%A4/data=!4m6!3m5!1s0x357ca44d749b1265:0x79ea8ce178befc27!8m2!3d37.5102663!4d127.080452!16s%2Fg%2F1tdcpgr6?entry=ttu&g_ep=EgoyMDI0MTExNy4wIKXMDSoASAFQAw%3D%3D" target="_blank" class="google_map_btn">Google Map</a>
            </div>
            <div class="ftr_info_area">
                <dl class="ftr_info_dl type_chatbot">
                    <dt class="ftr_info_dt">
                        <span class="txt">Мессенжэр зөвлөгөө :</span>
                    </dt>
                    <dd class="ftr_info_dd">
                        <span class="txt">Мессенжэр дээр "Рамиче-Монгол" гэж хайна уу.</span>
                    </dd>
                    <dd class="ftr_btn_dd">
                        <button class="btn chatbot_btn">Шууд зөвлөгөө авах</button>
                    </dd>
                </dl>
                <dl class="ftr_info_dl type_clock">
                    <dt class="ftr_info_dt">
                        <span class="txt">Эмчилгээний цаг(KST) :</span>
                    </dt>
                    <dd class="ftr_info_dd">
                        <div class="gird_box">
                            <span class="txt">Даваа/Лхагва/Баасан гараг</span>
                            <span class="txt">12:30 - 21:30</span>
                            <span class="txt">Мягмар/Пүрэв гараг</span>
                            <span class="txt">10:00 - 19:00</span>
                            <span class="txt">Бямба гарагт</span>
                            <span class="txt">09:00 - 15:00</span>
                        </div>
                        <span class="txt">"Ням гараг болон олон нийтийн амралтын өдрүүдэд амарна"</span>
                    </dd>
                </dl>
                <div class="sns_box">
                    <span class="txt">CLUBMIZ LAMICHE SNS</span>
                    <ul class="sns_list">
                        <li class="sns_item">
                            <a href="#" class="sns fb" aria-label="sns facebook"></a>
                        </li>
                        <li class="sns_item">
                            <a href="#" class="sns ig" aria-label="sns instagram"></a>
                        </li>
                        <li class="sns_item">
                            <a href="#" class="sns yt" aria-label="sns youtube"></a>
                        </li>
                    </ul>
                </div>
                <p class="copyright">Copyright ⓒ2021 by CLUBMIZ LAMICHE. All right reserved.</p>
            </div>
            <div class="counsel_area">
                <button class="show_btn" type="button">Шуурхай зөвлөгөө авах хүсэлт</button>
                <div class="counsel_modal">
                    <button class="close_btn" type="button">Шуурхай зөвлөгөө авах хүсэлт</button>
                    <div class="counsel_box">
                        <form action="" class="counsel_inner">
                            <div class="form_box">
                                <input class="ipt" type="text" placeholder="name"/>
                                <input class="ipt" type="text" placeholder="e-mail"/>
                                <input class="ipt" type="text" placeholder="phone number"/>
                            </div>
                            <button type="submit" class="submit_btn">
                                Шууд <br/>зөвлөгөө<br/>авах 
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        $("#footer").html(temp);
    }
}
window.addEventListener('DOMContentLoaded', function() {
    include.header();
    include.footer();
});
