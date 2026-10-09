/**
 * ==============================================================================
 * ROBEXA VIETNAM - OFFICIAL HOMEPAGE APPLICATION SCRIPT (main.js)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    console.log('[Robexa] Main application initialized.');

    /* ==========================================================================
       1. GLOBAL SETUP & LAZY LOADING HELPERS
       ========================================================================== */
    // Ensure all data-src images are loaded
    document.querySelectorAll('img[data-src]').forEach(function (img) {
        var dsrc = img.getAttribute('data-src');
        if (dsrc && (!img.src || img.src.indexOf('data:image') !== -1 || img.src === window.location.href)) {
            img.src = dsrc;
        }
        img.classList.add('loaded');
    });

    // Fix elements with data-bg
    document.querySelectorAll('[data-bg]').forEach(function (el) {
        var bg = el.getAttribute('data-bg');
        if (bg) {
            if (bg.startsWith('//')) bg = 'https:' + bg;
            el.style.backgroundImage = 'url(' + bg + ')';
        }
    });

    // Toast notification helper for demo
    function showDemoToast(msg) {
        var existing = document.getElementById('demo-toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.id = 'demo-toast';
        toast.className = 'demo-toast-popup';
        toast.innerHTML = '<span>' + (msg || '💡 Bạn đang trải nghiệm bản Demo trang chủ Robexa.vn') + '</span>';
        document.body.appendChild(toast);

        setTimeout(function () { toast.classList.add('show'); }, 10);
        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 300);
        }, 3000);
    }

    // Smooth scroll for internal anchors & close mobile menu if opened
    document.addEventListener('click', function (e) {
        var a = e.target.closest('a');
        if (!a) return;

        var href = a.getAttribute('href');

        // Demo notice links
        if (a.hasAttribute('data-demo-notice') || href === 'javascript:void(0)' || href === 'javascript:;') {
            e.preventDefault();
            showDemoToast('💡 Tính năng xem chi tiết trang con được khóa trong bản Demo trang chủ.');
            return;
        }

        // Anchor links within page
        if (href && href.startsWith('#')) {
            if (href === '#' || href === '#!') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                closeMobileMenu();

                var headerHeight = 70;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }
    });

    // Handle demo lead form submission
    document.querySelectorAll('.lead-form, form[data-lead-form]').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showDemoToast('✅ Đăng ký Demo thành công! (Dữ liệu thử nghiệm trên bản Demo)');
            form.reset();
        });
    });


    /* ==========================================================================
       2. MOBILE DRAWER NAVIGATION & ACCORDION (INITIALIZED IN SECTION 15)
       ========================================================================== */
    // Note: Mobile drawer & accordion functionality is handled comprehensively in initMobileHamburgerMenu()


    /* ==========================================================================
       3. DESKTOP MEGA MENU DROPDOWN & TABS (DEBOUNCED HOVER & SWITCHING)
       ========================================================================== */
    if (window.jQuery) {
        var $j = window.jQuery;
        var megaTimer;

        $j(document).on(
            'mouseenter',
            '.mega-menu-wrapper, .page-grid-menu-wrapper, .mega-menu-dropdown, .page-grid-dropdown',
            function () {
                clearTimeout(megaTimer);

                var $current = $j(this).closest('.mega-menu-wrapper, .page-grid-menu-wrapper');
                if ($current.length === 0) {
                    $current = $j(this);
                }

                $j('.menuList-main > li.has-submenu')
                    .not($current)
                    .removeClass('is-hover');

                $j('.menuList-main > li.has-submenu')
                    .not($current)
                    .find('.mega-menu-dropdown, .page-grid-dropdown')
                    .removeClass('is-hover');

                $current.addClass('is-hover');
                $current.find('.mega-menu-dropdown, .page-grid-dropdown').addClass('is-hover');
            }
        );

        $j(document).on(
            'mouseleave',
            '.mega-menu-wrapper, .page-grid-menu-wrapper, .mega-menu-dropdown, .page-grid-dropdown',
            function () {
                megaTimer = setTimeout(function () {
                    $j('.menuList-main > li.has-submenu').removeClass('is-hover');
                    $j('.mega-menu-dropdown, .page-grid-dropdown').removeClass('is-hover');
                }, 350);
            }
        );

        // Close on clicking outside
        $j(document).on('click', function (e) {
            if (!$j(e.target).closest('.has-submenu, .mega-menu-dropdown, .page-grid-dropdown').length) {
                $j('.menuList-main > li.has-submenu').removeClass('is-hover');
                $j('.mega-menu-dropdown, .page-grid-dropdown').removeClass('is-hover');
            }
        });

        // Tab Switching for Level 2 (Hover & Click)
        $j(document).on('mouseenter click', '.mega-item-lvl2 > .mega-link-lvl2', function (e) {
            if (e.type === 'click') e.preventDefault();
            var $link = $j(this);
            var $item = $link.closest('.mega-item-lvl2');
            var targetId = $item.attr('data-target');
            var $dropdown = $item.closest('.mega-menu-dropdown');

            if (!$item.hasClass('active')) {
                $dropdown.find('.mega-item-lvl2').not($item).removeClass('active');
                $item.addClass('active');

                $dropdown.find('.mega-pane-lvl2').removeClass('active');
                var $targetPane = $j('#' + targetId);
                $targetPane.addClass('active');

                var $firstLvl3 = $item.find('.mega-item-lvl3').first();
                if ($firstLvl3.length > 0) {
                    $item.find('.mega-item-lvl3').removeClass('active');
                    $firstLvl3.addClass('active');
                    var prodTargetId = $firstLvl3.attr('data-target');
                    $targetPane.find('.mega-pane-prods').removeClass('active');
                    $j('#' + prodTargetId).addClass('active');
                }
            }
        });

        // Tab Switching for Level 3 (Robot categories: vệ sinh, giao hàng, vận chuyển, AI, phụ kiện)
        $j(document).on('mouseenter click', '.mega-sidebar-lvl2 .mega-item-lvl3', function (e) {
            if (e.type === 'click') {
                e.preventDefault();
                e.stopPropagation();
            }
            var $item = $j(this);
            var targetId = $item.attr('data-target');
            var $list = $item.closest('.mega-list-lvl3');
            var $parentLvl2 = $item.closest('.mega-item-lvl2');
            var $dropdown = $item.closest('.mega-menu-dropdown');

            if ($parentLvl2.length && !$parentLvl2.hasClass('active')) {
                $dropdown.find('.mega-item-lvl2').not($parentLvl2).removeClass('active');
                $parentLvl2.addClass('active');
                var parentTargetId = $parentLvl2.attr('data-target');
                $dropdown.find('.mega-pane-lvl2').removeClass('active');
                $j('#' + parentTargetId).addClass('active');
            }

            $list.find('.mega-item-lvl3').removeClass('active');
            $item.addClass('active');

            var $targetProd = $j('#' + targetId);
            if ($targetProd.length) {
                var $paneLvl2 = $targetProd.closest('.mega-pane-lvl2');
                $paneLvl2.find('.mega-pane-prods').removeClass('active');
                $targetProd.addClass('active');
            }
        });
    }


    /* ==========================================================================
       4. HERO SLIDER & VIDEO HANDLER
       ========================================================================== */
    var videos = document.querySelectorAll('#homepage-slider .heroVideo');
    if (videos.length) {
        function updateVideoSources() {
            var isMobile = window.matchMedia('(max-width: 767px)').matches;
            videos.forEach(function (video) {
                var src = isMobile
                    ? video.getAttribute('data-src-mobile') || video.getAttribute('data-src')
                    : video.getAttribute('data-src-desktop') || video.getAttribute('data-src');
                if (src && video.src !== src) {
                    video.src = src;
                    video.load();
                }
            });
        }
        updateVideoSources();
        window.addEventListener('resize', updateVideoSources);
    }


    /* ==========================================================================
       5. BRAND STRIP MARQUEE TICKER (PAUSE ON HOVER)
       ========================================================================== */
    document.querySelectorAll('.marquee .brand').forEach(function (item) {
        item.addEventListener('mouseenter', function () {
            var track = this.closest('.marquee-track');
            if (track) track.style.animationPlayState = 'paused';
        });
        item.addEventListener('mouseleave', function () {
            var track = this.closest('.marquee-track');
            if (track) track.style.animationPlayState = 'running';
        });
    });


    /* ==========================================================================
       6. INDUSTRY SOLUTIONS INTERACTIVE CARDS
       ========================================================================== */
    document.addEventListener('click', function (e) {
        var toggle = e.target.closest('.industries-toggle');
        if (!toggle) return;
        var card = toggle.closest('.industries-card');
        if (!card) return;
        card.classList.toggle('is-open');
    });


    /* ==========================================================================
       7. ROBOT MATCH FINDER (STEP-BY-STEP INTERACTIVE WIZARD)
       ========================================================================== */
    (function initRobotMatchWizard() {
const matchQuiz = document.getElementById('matchQuiz');
            if (!matchQuiz) return;

            const matchBar = document.getElementById('matchBar');
            const matchStepNow = document.getElementById('matchStepNow');
            const matchStepTotal = document.getElementById('matchStepTotal');
            const matchBack = document.getElementById('matchBack');
            const matchResult = document.getElementById('matchResult');
            const matchCombo = document.getElementById('matchCombo');
            const matchRestart = document.getElementById('matchRestart');
            const matchBudgetGo = document.getElementById('matchBudgetGo');
            const matchBudgetInput = document.getElementById('matchBudgetInput');
            const matchToContact = document.getElementById('matchToContact');

            const steps = Array.from(matchQuiz.querySelectorAll('.match-step'));
            const totalSteps = steps.length;
            if (matchStepTotal) matchStepTotal.textContent = totalSteps;

            let currentStep = 0;
            let currentMatchedProducts = [];
            const userChoices = {
                collection: '',
                step2: '',
                step3: '',
                step4: '',
                step5: ''
            };

            // Read products from HTML data attributes (Haravan Compatible)
            const productsData = [];
            const productItems = document.querySelectorAll('.match-product-item');

            productItems.forEach(item => {
                const id = item.getAttribute('data-id');
                const title = item.getAttribute('data-title') || '';
                const url = item.getAttribute('data-url') || '';
                const price = item.getAttribute('data-price') || '';
                const image = item.getAttribute('data-image') || '';
                const coll = item.getAttribute('data-collection') || '';
                const desc = item.getAttribute('data-desc') || '';
                const rawTags = item.getAttribute('data-tags') || '';
                const tags = rawTags ? rawTags.split('|||') : [];

                productsData.push({
                    id: id,
                    title: title,
                    url: url,
                    price: price,
                    image: image,
                    collections: [coll],
                    tags: tags,
                    desc: desc
                });
            });

            function updateStepUI() {
                steps.forEach((step, idx) => {
                    if (idx === currentStep) {
                        step.classList.add('is-active');
                    } else {
                        step.classList.remove('is-active');
                    }
                });

                if (matchStepNow) matchStepNow.textContent = currentStep + 1;
                if (matchBar) matchBar.style.width = ((currentStep + 1) / totalSteps * 100) + '%';
                if (matchBack) matchBack.hidden = (currentStep === 0);
            }

            // Handle option click inside steps: select item -> highlight -> advance step
            steps.forEach((step) => {
                const options = step.querySelectorAll('.match-opt');
                options.forEach(opt => {
                    opt.addEventListener('click', function () {
                        options.forEach(o => o.classList.remove('is-selected'));
                        this.classList.add('is-selected');

                        const key = this.getAttribute('data-key');
                        const val = this.getAttribute('data-val');
                        if (key && val) {
                            userChoices[key] = val;
                        }

                        setTimeout(function () {
                            if (currentStep < totalSteps - 1) {
                                currentStep++;
                                updateStepUI();
                            } else {
                                showResults();
                            }
                        }, 220);
                    });
                });
            });

            if (matchBack) {
                matchBack.addEventListener('click', function () {
                    if (currentStep > 0) {
                        currentStep--;
                        updateStepUI();
                    }
                });
            }

            if (matchBudgetGo) {
                matchBudgetGo.addEventListener('click', function () {
                    const budgetVal = matchBudgetInput ? matchBudgetInput.value.trim() : '';
                    if (budgetVal) {
                        userChoices['customBudget'] = budgetVal;
                    }
                    showResults();
                });
            }

            function showResults() {
                matchQuiz.hidden = true;
                matchResult.hidden = false;

                const selectedCollection = userChoices.collection;
                const selectedTags = [
                    userChoices.step2,
                    userChoices.step3,
                    userChoices.step4,
                    userChoices.step5
                ].filter(Boolean);

                let matched = [];

                if (productsData.length > 0) {
                    let pool = productsData;
                    if (selectedCollection) {
                        const byColl = productsData.filter(p => p.collections && p.collections.includes(selectedCollection));
                        if (byColl.length > 0) pool = byColl;
                    }

                    const scored = pool.map(p => {
                        let score = 0;
                        if (p.tags && Array.isArray(p.tags)) {
                            selectedTags.forEach(t => {
                                if (p.tags.includes(t)) score++;
                            });
                        }
                        return {product: p, score: score};
                    });

                    scored.sort((a, b) => b.score - a.score);
                    matched = scored.map(s => s.product);
                }

                currentMatchedProducts = matched.slice(0, 4);

                if (matchCombo) {
                    matchCombo.innerHTML = '';
                    if (currentMatchedProducts.length > 0) {
                        currentMatchedProducts.forEach(p => {
                            const li = document.createElement('li');
                            li.className = 'match-combo-item';

                            li.innerHTML = `
                <a href="${p.url}" class="match-combo-thumb">
                  <img src="${p.image || ''}" alt="${p.title}" loading="lazy">
                </a>
                <a href="${p.url}" class="match-combo-model">${p.title}</a>
                <p class="match-combo-role">${p.desc || ''}</p>
              `;
                            matchCombo.appendChild(li);
                        });
                    } else {
                        matchCombo.innerHTML = `
              <li class="match-combo-item">
                <span class="match-combo-thumb"><img src="//cdn.hstatic.net/themes/200001202310/1001515490/14/no_image.jpg?v=309" alt="Gợi ý"></span>
                <span class="match-combo-model">Giải pháp gợi ý</span>
                <span class="match-combo-role">Liên hệ để nhận tư vấn phù hợp nhất</span>
              </li>
            `;
                    }
                }
            }

            if (matchRestart) {
                matchRestart.addEventListener('click', function () {
                    currentStep = 0;
                    currentMatchedProducts = [];
                    userChoices.collection = '';
                    userChoices.step2 = '';
                    userChoices.step3 = '';
                    userChoices.step4 = '';
                    userChoices.step5 = '';
                    matchResult.hidden = true;
                    matchQuiz.hidden = false;
                    updateStepUI();
                });
            }

            if (matchToContact) {
                matchToContact.addEventListener('click', function () {
                    if (currentMatchedProducts && currentMatchedProducts.length > 0) {
                        const formattedItems = currentMatchedProducts.map(p => {
                            let text = `- ${p.title}`;
                            if (p.desc) {
                                text += `: ${p.desc}`;
                            }
                            return text;
                        }).join('\n');

                        const messageContent = `Tôi muốn nhận tư vấn & báo giá cho các sản phẩm gợi ý:\n${formattedItems}`;

                        const messageInput = document.querySelector('.cta-leadform textarea[name="message"]')
                            || document.querySelector('textarea[name="message"]')
                            || document.querySelector('textarea[name="contact[body]"]')
                            || document.querySelector('.lead-textarea')
                            || document.querySelector('textarea');

                        if (messageInput) {
                            messageInput.value = messageContent;
                            messageInput.dispatchEvent(new Event('input', { bubbles: true }));
                            messageInput.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }

                    const targetSection = document.querySelector('.hcta')
                        || document.querySelector('.cta-leadform')
                        || document.getElementById('popup-contact')
                        || document.querySelector('footer');

                    if (targetSection) {
                        const header = document.querySelector('.mainHeader') || document.querySelector('header');
                        const headerOffset = header ? header.offsetHeight + 15 : 80;
                        const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            }

            updateStepUI();
        })();


    /* ==========================================================================
       8. PRODUCT CARDS VIDEO PREVIEW ON HOVER
       ========================================================================== */
    (function initPcardVideos() {
        var pcards = document.querySelectorAll('.pcard');
        pcards.forEach(function (card) {
            var video = card.querySelector('video');
            if (!video || card.dataset.videoHoverBound) return;
            card.dataset.videoHoverBound = '1';

            card.addEventListener('mouseenter', function () {
                var playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(function () {});
                }
            });

            card.addEventListener('mouseleave', function () {
                video.pause();
                try { video.currentTime = 0; } catch (err) {}
            });
        });
    })();


    /* ==========================================================================
       9. MOBILE BOTTOM BAR, SHEET & HOTLINE DROPDOWN
       ========================================================================== */
    // Explore sheet
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.rbxExploreBtn');
        if (btn) {
            e.preventDefault();
            var sheet = document.querySelector('.rbx-sheet');
            if (sheet) sheet.classList.add('open');
        }

        if (e.target.closest('.rbx-sheet-bd') || e.target.closest('.rbx-sheet-close')) {
            var openSheet = document.querySelector('.rbx-sheet.open');
            if (openSheet) openSheet.classList.remove('open');
        }
    });

    // Hotline menu dropdown
    (function initTopbarBottom() {
        var trigger = document.getElementById('rbxHotlineTrigger');
        var menu = document.getElementById('rbxHotlineMenu');
        var closeBtn = document.getElementById('rbxHotlineClose');

        if (trigger && menu) {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                menu.classList.toggle('is-open');
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                    menu.classList.remove('is-open');
                });
            }

            document.addEventListener('click', function (e) {
                if (!menu.contains(e.target) && e.target !== trigger) {
                    menu.classList.remove('is-open');
                }
            });
        }
    })();


    /* ==========================================================================
       10. FLOATING SUPPORT PANEL & BACK-TO-TOP
       ========================================================================== */
    (function initFloatingSupport() {
        var support = document.getElementById('rbxSupport') || document.querySelector('.rbx-support');
        if (!support) return;
        var trigger = document.getElementById('rbxSupportTrigger') || support.querySelector('.rbx-fab');
        var panel = document.getElementById('rbxSupportPanel') || support.querySelector('.rbx-panel');
        var closeBtn = document.getElementById('rbxSupportClose') || support.querySelector('.rbx-close');

        if (trigger && panel) {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var isActive = support.classList.toggle('active');
                panel.classList.toggle('is-open', isActive);
                trigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    support.classList.remove('active');
                    panel.classList.remove('is-open');
                    trigger.setAttribute('aria-expanded', 'false');
                });
            }

            document.addEventListener('click', function (e) {
                if (!support.contains(e.target)) {
                    support.classList.remove('active');
                    panel.classList.remove('is-open');
                    trigger.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Back to top scroll listener
        var backTop = document.querySelector('.back-to-top');
        if (backTop) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 300) {
                    backTop.classList.add('visible');
                } else {
                    backTop.classList.remove('visible');
                }
            });
            backTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    })();


        /* ==========================================================================
       11. GLOBAL SEARCH MODAL OVERLAY (SEARCH MODAL LIKE IMAGE 1)
       ========================================================================== */
    function initGlobalSearchModal() {
        var searchTriggers = document.querySelectorAll('#site-search-handle, .header-action_search a, .header-action_search, .mb-search-btn');
        var gspOverlay = document.getElementById('gsp-overlay');
        var gspBackdrop = document.getElementById('gsp-backdrop');
        var gspBtnEsc = document.getElementById('gsp-btn-esc');
        var gspInput = document.getElementById('gsp-input');
        var gspBtnClear = document.getElementById('gsp-btn-clear');
        var resultItems = document.querySelectorAll('.gsp-result-item');

        if (!gspOverlay) return;

        function openSearch(e) {
            if (e) e.preventDefault();
            gspOverlay.classList.add('gsp-active');
            gspOverlay.setAttribute('aria-hidden', 'false');
            document.body.classList.add('locked-scroll');
            setTimeout(function() {
                if (gspInput) {
                    gspInput.focus();
                    if (gspInput.value) gspInput.select();
                }
            }, 100);
        }

        function closeSearch(e) {
            if (e) e.preventDefault();
            gspOverlay.classList.remove('gsp-active');
            gspOverlay.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('locked-scroll');
        }

        searchTriggers.forEach(function(trig) {
            trig.addEventListener('click', openSearch);
        });

        if (gspBackdrop) gspBackdrop.addEventListener('click', closeSearch);
        if (gspBtnEsc) gspBtnEsc.addEventListener('click', closeSearch);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && gspOverlay.classList.contains('gsp-active')) {
                closeSearch();
            }
        });

        // Search input live filtering
        if (gspInput) {
            gspInput.addEventListener('input', function() {
                var query = this.value.trim().toLowerCase();
                if (gspBtnClear) {
                    gspBtnClear.style.display = query.length > 0 ? 'flex' : 'none';
                }

                resultItems.forEach(function(item) {
                    var text = item.textContent.toLowerCase();
                    if (!query || text.indexOf(query) !== -1) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }

        if (gspBtnClear && gspInput) {
            gspBtnClear.addEventListener('click', function(e) {
                e.preventDefault();
                gspInput.value = '';
                gspInput.focus();
                gspBtnClear.style.display = 'none';
                resultItems.forEach(function(item) {
                    item.style.display = 'flex';
                });
            });
        }

        // Close on result item click if internal anchor
        resultItems.forEach(function(item) {
            item.addEventListener('click', function() {
                var href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    closeSearch();
                }
            });
        });
    }
    initGlobalSearchModal();


    /* ==========================================================================
       13. MULTI-LANGUAGE SWITCHER (INSTANT TRANSLATION & GOOGLE TRANSLATE)
       ========================================================================== */
    var TRANSLATIONS = {
        'vi': {
            'nav_products': 'Sản phẩm',
            'nav_solutions': 'Giải pháp',
            'nav_promotions': 'Chương trình khuyến mãi',
            'nav_resources': 'Tài nguyên',
            'nav_about': 'Về chúng tôi',
            'nav_contact': 'Liên hệ',
            'hero_brand': 'Robot PUDU tại Việt Nam',
            'hero_h1': 'Robexa — Giải pháp robot <br> cho doanh nghiệp',
            'hero_sub': 'Robexa tư vấn và triển khai robot phục vụ, vệ sinh và vận chuyển công nghiệp với công nghệ PUDU, cùng dịch vụ hỗ trợ tại Việt Nam.',
            'hero_btn': 'Nhận tư vấn',
            'hotline_title': 'Hotline tư vấn',
            'call_btn': 'Gọi',
            'demo_free': 'Demo miễn phí',
            'search_placeholder': 'Tìm sản phẩm, giải pháp, số điện thoại, địa chỉ...'
        },
        'en': {
            'nav_products': 'Products',
            'nav_solutions': 'Solutions',
            'nav_promotions': 'Promotions',
            'nav_resources': 'Resources',
            'nav_about': 'About Us',
            'nav_contact': 'Contact Us',
            'hero_brand': 'PUDU Robotics in Vietnam',
            'hero_h1': 'Robexa — Robotic Solutions <br> For Enterprises',
            'hero_sub': 'Robexa provides consulting and deployment of delivery, cleaning and industrial transport robots powered by PUDU technology with full local support in Vietnam.',
            'hero_btn': 'Get Consultation',
            'hotline_title': 'Consultation Hotline',
            'call_btn': 'Call',
            'demo_free': 'Free Demo',
            'search_placeholder': 'Search products, solutions, phone number, address...'
        },
        'zh-CN': {
            'nav_products': '产品',
            'nav_solutions': '解决方案',
            'nav_promotions': '促销活动',
            'nav_resources': '资源中心',
            'nav_about': '关于我们',
            'nav_contact': '联系我们',
            'hero_brand': 'PUDU机器人越南官方',
            'hero_h1': 'Robexa — 企业级机器人 <br> 整体解决方案',
            'hero_sub': 'Robexa在越南提供PUDU配送、清洁与工业搬运机器人的咨询、实施与本地化技术支持服务。',
            'hero_btn': '立即咨询',
            'hotline_title': '咨询热线',
            'call_btn': '呼叫',
            'demo_free': '免费演示',
            'search_placeholder': '搜索产品、方案、电话、地址...'
        },
        'ja': {
            'nav_products': '製品情報',
            'nav_solutions': 'ソリューション',
            'nav_promotions': 'キャンペーン',
            'nav_resources': '資料・知見',
            'nav_about': '会社概要',
            'nav_contact': 'お問い合わせ',
            'hero_brand': 'ベトナムにおけるPUDUロボティクス',
            'hero_h1': 'Robexa — 企業向け <br> ロボットソリューション',
            'hero_sub': 'RobexaはPUDU技術を核とした配膳、清掃、産業搬送ロボットの導入支援とベトナム国内サポートを提供します。',
            'hero_btn': '無料相談',
            'hotline_title': 'カスタマー窓口',
            'call_btn': '通話',
            'demo_free': '無料デモ',
            'search_placeholder': '製品、ソリューション、電話番号を検索...'
        },
        'ko': {
            'nav_products': '제품',
            'nav_solutions': '솔루션',
            'nav_promotions': '프로모션',
            'nav_resources': '리소스',
            'nav_about': '회사 소개',
            'nav_contact': '문의하기',
            'hero_brand': '베트남 공식 PUDU 로보틱스',
            'hero_h1': 'Robexa — 기업을 위한 <br> 첨단 로봇 솔루션',
            'hero_sub': 'Robexa는 베트남 현지에서 PUDU 기술 기반의 서빙, 청소 및 산업용 운송 로봇 컨설팅과 기술 지원을 제공합니다.',
            'hero_btn': '상담 신청',
            'hotline_title': '고객 상담 센터',
            'call_btn': '통화',
            'demo_free': '무료 데모',
            'search_placeholder': '제품, 솔루션, 전화번호, 주소 검색...'
        },
        'es': {
            'nav_products': 'Productos',
            'nav_solutions': 'Soluciones',
            'nav_promotions': 'Promociones',
            'nav_resources': 'Recursos',
            'nav_about': 'Sobre nosotros',
            'nav_contact': 'Contacto',
            'hero_brand': 'PUDU Robotics en Vietnam',
            'hero_h1': 'Robexa — Soluciones robóticas <br> para empresas',
            'hero_sub': 'Robexa asesora e implementa robots de reparto, limpieza y transporte industrial con tecnología PUDU y soporte en Vietnam.',
            'hero_btn': 'Solicitar asesoría',
            'hotline_title': 'Línea de consulta',
            'call_btn': 'Llamar',
            'demo_free': 'Demostración gratis',
            'search_placeholder': 'Buscar productos, soluciones, teléfono...'
        }
    };

    var originalDomCaptured = false;
    function captureOriginalDOM() {
        if (originalDomCaptured) return;
        originalDomCaptured = true;

        var heroH1 = document.querySelector('.lhero-inner h1');
        if (heroH1) heroH1._origHTML = heroH1.innerHTML;

        var inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        inputs.forEach(function(inp) {
            inp._origPlaceholder = inp.getAttribute('placeholder') || '';
        });

        try {
            var walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        var parent = node.parentElement;
                        if (!parent) return NodeFilter.FILTER_REJECT;
                        var tag = parent.tagName;
                        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'SVG' || tag === 'CODE' || tag === 'PRE') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (parent.closest('.notranslate') || parent.closest('.lang-dropdown-menu')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        var txt = node.nodeValue.trim();
                        if (!txt || txt.length < 2) return NodeFilter.FILTER_SKIP;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            var n;
            while ((n = walker.nextNode())) {
                n._origTextValue = n.nodeValue;
            }
        } catch (e) {}
    }

    function applyInPageTranslation(lang) {
        if (!lang) lang = 'vi';
        var isVi = (lang === 'vi');
        var dict = (window.ROBEXA_I18N && window.ROBEXA_I18N[lang]) ? window.ROBEXA_I18N[lang] : (TRANSLATIONS[lang] || {});

        // Ensure original DOM is captured first
        captureOriginalDOM();

        // 1. Full DOM Text Nodes Walker - translates ALL text nodes across the entire page
        try {
            var walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        var parent = node.parentElement;
                        if (!parent) return NodeFilter.FILTER_REJECT;
                        var tag = parent.tagName;
                        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'SVG' || tag === 'CODE' || tag === 'PRE') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (parent.closest('.notranslate') || parent.closest('.lang-dropdown-menu')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        var txt = node.nodeValue.trim();
                        if (!txt || txt.length < 2) return NodeFilter.FILTER_SKIP;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            var node;
            while ((node = walker.nextNode())) {
                if (typeof node._origTextValue === 'undefined') {
                    node._origTextValue = node.nodeValue;
                }
                if (isVi) {
                    node.nodeValue = node._origTextValue;
                } else {
                    var raw = node._origTextValue;
                    var trimmed = raw.trim();
                    if (dict[trimmed]) {
                        node.nodeValue = raw.replace(trimmed, dict[trimmed]);
                    } else {
                        var normalized = trimmed.replace(/\s+/g, ' ');
                        if (dict[normalized]) {
                            node.nodeValue = raw.replace(trimmed, dict[normalized]);
                        }
                    }
                }
            }
        } catch (walkerErr) {
            console.warn('[Robexa] TreeWalker error:', walkerErr);
        }

        // 2. Placeholders in search input, inputs, textareas
        try {
            var inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
            inputs.forEach(function(inp) {
                if (isVi) {
                    if (inp._origPlaceholder) inp.setAttribute('placeholder', inp._origPlaceholder);
                } else {
                    var origP = (inp._origPlaceholder || inp.getAttribute('placeholder') || '').trim();
                    if (dict[origP]) {
                        inp.setAttribute('placeholder', dict[origP]);
                    }
                }
            });
        } catch (inpErr) {}

        // 3. Hero H1 explicit check
        try {
            var heroH1 = document.querySelector('.lhero-inner h1');
            if (heroH1) {
                if (isVi) {
                    if (heroH1._origHTML) heroH1.innerHTML = heroH1._origHTML;
                } else if (dict['Robexa — Giải pháp robot'] && dict['cho doanh nghiệp']) {
                    heroH1.innerHTML = dict['Robexa — Giải pháp robot'] + '<br>' + dict['cho doanh nghiệp'];
                }
            }
        } catch (h1Err) {}

        console.log('[Robexa] Applied comprehensive full-page language translation for:', lang);
    }
    window.robexaChangeLanguage = applyInPageTranslation;

    function initLanguageDropdown() {
        var langBtn = document.querySelector('.lang-dropdown-btn');
        var langWrapper = document.querySelector('.lang-dropdown-wrapper');
        var langOptions = document.querySelectorAll('.lang-option');
        var currentFlagContainer = document.querySelector('.lang-current-flag');

        if (!langWrapper || !langBtn) return;

        langBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            langWrapper.classList.toggle('open');
        });

        langOptions.forEach(function(opt) {
            opt.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var langCode = this.getAttribute('data-lang');
                var langName = this.querySelector('.lang-name') ? this.querySelector('.lang-name').textContent.trim() : langCode;
                var flagBox = this.querySelector('.lang-flag-box');
                var flagHtml = flagBox ? flagBox.innerHTML : '';

                langOptions.forEach(function(o) { o.classList.remove('active'); });
                this.classList.add('active');

                if (currentFlagContainer && flagHtml) {
                    currentFlagContainer.innerHTML = flagHtml;
                }

                langWrapper.classList.remove('open');

                // 1. In-page instant UI translation
                applyInPageTranslation(langCode);


                try {
                    localStorage.setItem('selected_lang', langCode);
                } catch (err) {}

                showDemoToast('🌐 Ngôn ngữ: ' + langName);
            });
        });

        document.addEventListener('click', function(e) {
            if (!langWrapper.contains(e.target)) {
                langWrapper.classList.remove('open');
            }
        });

        // Restore language on load
        try {
            var savedLang = localStorage.getItem('selected_lang');
            if (savedLang && savedLang !== 'vi') {
                var savedOpt = document.querySelector('.lang-option[data-lang="' + savedLang + '"]');
                if (savedOpt) {
                    langOptions.forEach(function(o) { o.classList.remove('active'); });
                    savedOpt.classList.add('active');
                    var savedFlag = savedOpt.querySelector('.lang-flag-box');
                    if (currentFlagContainer && savedFlag) {
                        currentFlagContainer.innerHTML = savedFlag.innerHTML;
                    }
                    applyInPageTranslation(savedLang);
                }
            }
        } catch (err) {}
    }
    initLanguageDropdown();


    /* ==========================================================================
       15. MOBILE HAMBURGER MENU DRAWER (SLIDE FROM LEFT)
       ========================================================================== */
    function initMobileHamburgerMenu() {
        var hamburgerBtn = document.querySelector('.header-action_menu a, a[name="icon-menu-mobile"], .header-action_menu');
        var sidebarMain = document.querySelector('.sidebar-main');
        var sitenavMenu = document.querySelector('.sitenav-menu');
        var closeBtn = document.querySelector('.btn-sitenav-close, a[name="button-close"]');
        var overlay = document.querySelector('.sidebar-main .sidebar-overlay');

        if (!hamburgerBtn || !sidebarMain || !sitenavMenu) return;

        function openMenu(e) {
            if (e) e.preventDefault();
            sidebarMain.classList.add('is-show-left');
            sitenavMenu.classList.add('show');
            document.body.classList.add('locked-scroll');
        }

        function closeMenu(e) {
            if (e) e.preventDefault();
            sidebarMain.classList.remove('is-show-left');
            sitenavMenu.classList.remove('show');
            document.body.classList.remove('locked-scroll');
        }

        hamburgerBtn.addEventListener('click', openMenu);
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        if (overlay) overlay.addEventListener('click', closeMenu);

        // Submenu accordion toggles: clicking either parent link text OR the chevron button
        var parentLinks = sitenavMenu.querySelectorAll('.menuList-links li.has-submenu > a');
        parentLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var parentLi = this.closest('li.has-submenu');
                if (!parentLi) return;

                var isCurrentlyOpen = parentLi.classList.contains('opened');

                // Accordion behavior: close other open items at the same level
                if (parentLi.classList.contains('level0')) {
                    var siblings = parentLi.parentElement.querySelectorAll(':scope > li.level0.opened');
                    siblings.forEach(function(sib) {
                        if (sib !== parentLi) {
                            sib.classList.remove('opened');
                            var sub = sib.querySelector(':scope > ul.submenu-links');
                            if (sub) sub.style.display = 'none';
                        }
                    });
                } else if (parentLi.classList.contains('level1')) {
                    var siblings = parentLi.parentElement.querySelectorAll(':scope > li.level1.opened');
                    siblings.forEach(function(sib) {
                        if (sib !== parentLi) {
                            sib.classList.remove('opened');
                            var sub = sib.querySelector(':scope > ul.submenu-links');
                            if (sub) sub.style.display = 'none';
                        }
                    });
                }

                // Toggle current item
                var targetSubmenu = parentLi.querySelector(':scope > ul.submenu-links');
                if (isCurrentlyOpen) {
                    parentLi.classList.remove('opened');
                    if (targetSubmenu) targetSubmenu.style.display = 'none';
                } else {
                    parentLi.classList.add('opened');
                    if (targetSubmenu) targetSubmenu.style.display = 'block';
                }
            });
        });

        // Close drawer and navigate smoothly ONLY when clicking leaf links (actual items, not headers)
        var leafLinks = sitenavMenu.querySelectorAll('.menuList-links li:not(.has-submenu) > a, .sitenav-brand-logo');
        leafLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                closeMenu();
                if (href && href.startsWith('#')) {
                    var target = document.querySelector(href);
                    if (target) {
                        setTimeout(function() {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }, 250);
                    }
                }
            });
        });
    }
    initMobileHamburgerMenu();


    /* ==========================================================================
       16. MOBILE PHONE HOTLINE FAB & SPEED-DIAL POPUP (IMAGE 2)
       ========================================================================== */
    function initMobileHotlinePopup() {
        var hotlineFab = document.getElementById('rbxHotlineFab');
        var topbarBottom = document.getElementById('rbxTopbarBottom');

        if (!hotlineFab || !topbarBottom) return;

        hotlineFab.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            topbarBottom.classList.toggle('is-open');
            var isOpen = topbarBottom.classList.contains('is-open');
            hotlineFab.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        document.addEventListener('click', function(e) {
            if (!topbarBottom.contains(e.target)) {
                topbarBottom.classList.remove('is-open');
                hotlineFab.setAttribute('aria-expanded', 'false');
            }
        });
    }
    initMobileHotlinePopup();


    /* ==========================================================================
       17. HERO SLIDER OWL CAROUSEL (3 BANNER SLIDES AUTO-ROTATION)
       ========================================================================== */
    function initHeroOwlSlider() {
        if (window.jQuery && jQuery.fn.owlCarousel) {
            var $slider = jQuery('.slider-owl');
            if ($slider.length) {
                $slider.owlCarousel({
                    items: 1,
                    loop: true,
                    autoplay: true,
                    autoplayTimeout: 6500,
                    autoplayHoverPause: true,
                    smartSpeed: 800,
                    nav: true,
                    dots: true,
                    dotsEach: true,
                    responsiveRefreshRate: 100
                });
                console.log('OwlCarousel initialized on .slider-owl with 3 slides');
            }
        }
    }
    initHeroOwlSlider();


    /* ==========================================================================
       12. SCROLL REVEAL ANIMATIONS (SMOOTH INTERSECTION OBSERVER)
       ========================================================================== */
    function initScrollReveal() {
        var reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        function checkVisibleNow() {
            var windowHeight = window.innerHeight;
            reveals.forEach(function (el) {
                var rect = el.getBoundingClientRect();
                // If section is already within viewport
                if (rect.top <= windowHeight - 50 && rect.bottom >= 0) {
                    el.classList.add('in');
                }
            });
        }

        if ('IntersectionObserver' in window) {
            var revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px'
            });

            reveals.forEach(function (el) {
                var rect = el.getBoundingClientRect();
                // If already visible on initial page load, show it
                if (rect.top <= window.innerHeight - 50 && rect.bottom >= 0) {
                    el.classList.add('in');
                } else {
                    revealObserver.observe(el);
                }
            });
        } else {
            window.addEventListener('scroll', checkVisibleNow);
            checkVisibleNow();
        }
    }
    initScrollReveal();

    

    /* ==========================================================================
       14. UNIVERSAL SMART HEADER (AUTO-HIDE ON SCROLL DOWN, REVEAL ON SCROLL UP)
       WITH DYNAMIC TOPBAR HEIGHT & FROSTED GLASS AT TOP
       ========================================================================== */
    function initUniversalSmartHeader() {
        var header = document.getElementById('site-header') || document.querySelector('.mainHeader');
        var headerWrapper = document.querySelector('.mainHeader--height');
        var topbar = document.querySelector('.topbar');
        if (!header) return;

        var lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
        var scrollThreshold = 8;
        var isTicking = false;

        function updateMetrics() {
            if (topbar) {
                var tbHeight = topbar.offsetHeight || 35;
                document.documentElement.style.setProperty('--topbar-height', tbHeight + 'px');
            }
        }
        updateMetrics();
        window.addEventListener('resize', updateMetrics);
        window.addEventListener('load', updateMetrics);

        window.addEventListener('scroll', function () {
            if (!isTicking) {
                window.requestAnimationFrame(function () {
                    var currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
                    var topbarHeight = topbar ? topbar.offsetHeight : 35;

                    // If mobile menu or desktop mega menu is open, keep header visible
                    var isMenuOpen = document.body.classList.contains('locked-scroll') ||
                                     document.querySelector('.sitenav-menu.show') ||
                                     document.querySelector('.mega-menu-wrapper.is-hover');

                    if (isMenuOpen) {
                        header.classList.remove('header-scroll-down');
                        header.classList.add('header-scroll-up');
                        lastScrollY = currentScrollY;
                        isTicking = false;
                        return;
                    }

                    var diff = currentScrollY - lastScrollY;

                    // When at or near the very top of the page
                    if (currentScrollY <= topbarHeight + 5) {
                        header.classList.remove('is-sticky');
                        header.classList.remove('header-scroll-down');
                        header.classList.remove('header-scroll-up');
                    } else {
                        // Scrolled past topbar: activate sticky mode
                        header.classList.add('is-sticky');

                        if (diff > scrollThreshold && currentScrollY > topbarHeight + 30) {
                            // SCROLLING DOWN -> HIDE HEADER (BOTH PC & MOBILE)
                            header.classList.remove('header-scroll-up');
                            header.classList.add('header-scroll-down');
                        } else if (diff < -scrollThreshold) {
                            // SCROLLING UP -> SHOW HEADER (BOTH PC & MOBILE)
                            header.classList.remove('header-scroll-down');
                            header.classList.add('header-scroll-up');
                        }
                    }

                    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
                    isTicking = false;
                });
                isTicking = true;
            }
        }, { passive: true });
    }
    initUniversalSmartHeader();

});
