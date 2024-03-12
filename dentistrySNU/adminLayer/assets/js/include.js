const include = {
    header: function() {
        const temp = /* html */`
            <div class="bottom_area">
                <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                    <a class="nav-item nav-link me-xl-4" href="javascript:void(0)">
                        <i class="bx bx-menu bx-sm"></i>
                    </a>
                </div>
                <h1 class="logo" aria-label="서울대학교 치의학박물관"></h1>
                <div class="etc_area">
                    <div class="navbar-nav align-items-xl-center ms-3 me-xl-0 d-xl-none">
                        <a class="nav-item nav-link me-xl-4" href="javascript:void(0)">
                            <i class='bx bx-grid-alt'></i>
                        </a>
                    </div>
                    <div class="etc_inner">
                        <div class="etc_box system_box">
                            <a class="etc_btn system_btn" href="../../systemAdmin/systemAdmin/modify.html">
                                <i class='bx bxs-user-detail'></i>
                                <div class="txt_box">
                                    <span class="admin_name">시스템관리자</span>
                                    <span class="user_name">ADMIN</span>
                                </div>
                            </a>
                        </div>
                        <div class="etc_box">
                            <a class="etc_btn" href="../../login.html">
                                로그아웃
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $(".header").html(temp);
    },
    aside: function() {
        const temp = /* html */`
            <div class="menu-inner-shadow"></div>

            <ul class="menu-inner py-1">
                <li class="menu-item">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                        <span class="txt">전시 관리</span>
                    </a>
                    <ul class="menu-sub">
                        <li class="menu-item">
                            <a href="../../exhibit/online/list.html" class="menu-link">
                                <span class="txt">온라인전시</span>
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="../../exhibit/prmnt/list.html" class="menu-link">
                                <span class="txt">기획전시</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="menu-item">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                        <span class="txt">유물 관리</span>
                    </a>
                    <ul class="menu-sub">
                        <li class="menu-item">
                            <a href="../../collection/relics/list.html" class="menu-link">
                                <span class="txt">소장유물</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="menu-item">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                        <span class="txt">교육 관리</span>
                    </a>
                    <ul class="menu-sub">
                        <li class="menu-item">
                            <a href="../../edu/cnt/list.html" class="menu-link">
                                <span class="txt">교육 컨텐츠</span>
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="../../edu/video/list.html" class="menu-link">
                                <span class="txt">교육 동영상</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="menu-item">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                        <span class="txt">자료 관리</span>
                    </a>
                    <ul class="menu-sub">
                        <li class="menu-item">
                            <a href="../../academicData/publish/list.html" class="menu-link">
                                <span class="txt">발간도서</span>
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="../../academicData/research/list.html" class="menu-link">
                                <span class="txt">조사연구</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="menu-item">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                        <span class="txt">소식 관리</span>
                    </a>
                    <ul class="menu-sub">
                        <li class="menu-item">
                            <a href="../../news/notice/list.html" class="menu-link">
                                <span class="txt">공지사항</span>
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="../../news/report/list.html" class="menu-link">
                                <span class="txt">보도자료</span>
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="../../news/evt/list.html" class="menu-link">
                                <span class="txt">행사</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="menu-item">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                        <span class="txt">팝업 관리</span>
                    </a>
                    <ul class="menu-sub">
                        <li class="menu-item">
                            <a href="../../popup/popup/list.html" class="menu-link">
                                <span class="txt">공지 팝업</span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        `;
        $(".layout-menu").html(temp);
    },
}
include.header();
include.aside();
window.addEventListener('DOMContentLoaded',()=>{});
