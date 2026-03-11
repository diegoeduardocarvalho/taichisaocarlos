(function () {
    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback, { once: true });
            return;
        }
        callback();
    }

    function slugify(value) {
        return String(value)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function resolveHref(item, root, isHome) {
        if (!item || !item.href) {
            return "#";
        }

        if (item.type === "external") {
            return item.href;
        }

        if (item.type === "home-section") {
            return isHome ? item.href : root + "index.html" + item.href;
        }

        return root + item.href;
    }

    function ensureHeadAssets(root) {
        var head = document.head;
        if (!head) {
            return;
        }

        var faviconHref = root + "favicon.svg?v=20260311";
        var icon = head.querySelector('link[rel="icon"]');

        if (!icon) {
            icon = document.createElement("link");
            icon.setAttribute("rel", "icon");
            head.appendChild(icon);
        }

        icon.setAttribute("type", "image/svg+xml");
        icon.setAttribute("href", faviconHref);
    }

    function isItemActive(item, currentPage) {
        if (!item) {
            return false;
        }

        if (item.key && item.key === currentPage) {
            return true;
        }

        return Array.isArray(item.children)
            ? item.children.some(function (child) {
                  return isItemActive(child, currentPage);
              })
            : false;
    }

    function renderMenuItems(items, root, isHome, currentPage, dropdownClass) {
        return items
            .map(function (item, index) {
                if (item.children && item.children.length) {
                    var dropdownId = "site-menu-" + slugify(item.label) + "-" + index;
                    var childMarkup = item.children
                        .map(function (child) {
                            return (
                                '<li><a class="dropdown-item site-dropdown-link' +
                                (isItemActive(child, currentPage) ? " active" : "") +
                                '" href="' +
                                resolveHref(child, root, isHome) +
                                '">' +
                                escapeHtml(child.label) +
                                "</a></li>"
                            );
                        })
                        .join("");

                    return (
                        '<li class="nav-item dropdown">' +
                        '<a class="nav-link dropdown-toggle site-nav-link' +
                        (isItemActive(item, currentPage) ? " active" : "") +
                        '" href="#" id="' +
                        dropdownId +
                        '" role="button" data-bs-toggle="dropdown" aria-expanded="false">' +
                        escapeHtml(item.label) +
                        "</a>" +
                        '<ul class="dropdown-menu ' +
                        dropdownClass +
                        '" aria-labelledby="' +
                        dropdownId +
                        '">' +
                        childMarkup +
                        "</ul>" +
                        "</li>"
                    );
                }

                var classes = ["nav-link", "site-nav-link"];
                if (isItemActive(item, currentPage)) {
                    classes.push("active");
                }
                if (item.type === "home-section" && isHome) {
                    classes.push("smoothScroll");
                }

                return (
                    '<li class="nav-item">' +
                    '<a class="' +
                    classes.join(" ") +
                    '" href="' +
                    resolveHref(item, root, isHome) +
                    '">' +
                    escapeHtml(item.label) +
                    "</a>" +
                    "</li>"
                );
            })
            .join("");
    }

    function renderHeader(config, root, isHome, currentPage) {
        var container = document.querySelector("[data-site-header]");
        if (!container) {
            return;
        }

        var menuMarkup = renderMenuItems(config.menu, root, isHome, currentPage, "site-dropdown-menu");
        var primaryCta = resolveHref(config.ctas.primary, root, isHome);
        var secondaryCta = resolveHref(config.ctas.secondary, root, isHome);

        container.innerHTML =
            '<header class="site-header">' +
            '<div class="container">' +
            '<nav class="navbar navbar-expand-lg site-navbar" aria-label="Navegacao principal">' +
            '<div class="container-fluid px-0">' +
            '<a class="navbar-brand site-brand" href="' +
            (root + "index.html") +
            '">' +
            '<span class="site-brand-mark">TC</span>' +
            '<span class="site-brand-copy">' +
            "<strong>" +
            escapeHtml(config.brandLabel) +
            "</strong>" +
            "<small>" +
            escapeHtml(config.siteName) +
            "</small>" +
            "</span>" +
            "</a>" +
            '<button class="navbar-toggler site-navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#siteNavbar" aria-controls="siteNavbar" aria-expanded="false" aria-label="Abrir menu">' +
            '<span class="navbar-toggler-icon"></span>' +
            "</button>" +
            '<div class="collapse navbar-collapse" id="siteNavbar">' +
            '<ul class="navbar-nav mx-auto mb-2 mb-lg-0">' +
            menuMarkup +
            "</ul>" +
            '<div class="site-header-actions">' +
            '<a class="site-button site-button-secondary" href="' +
            secondaryCta +
            '">' +
            escapeHtml(config.ctas.secondary.label) +
            "</a>" +
            '<a class="site-button site-button-primary" href="' +
            primaryCta +
            '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(config.ctas.primary.label) +
            "</a>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</nav>" +
            "</div>" +
            "</header>";
    }

    function renderFooter(config) {
        var container = document.querySelector("[data-site-footer]");
        if (!container) {
            return;
        }

        var facts = config.quickFacts
            .map(function (item) {
                return "<li>" + escapeHtml(item) + "</li>";
            })
            .join("");

        container.innerHTML =
            '<footer class="site-footer">' +
            '<div class="container">' +
            '<div class="row g-4 align-items-start">' +
            '<div class="col-lg-5">' +
            '<p class="site-footer-eyebrow">Tai Chi Chuan S\u00e3o Carlos</p>' +
            '<h3 class="site-footer-title">' +
            escapeHtml(config.siteSubtitle) +
            "</h3>" +
            '<p class="site-footer-copy">Aulas ao ar livre em S\u00e3o Carlos, com foco em estrutura, mobilidade, equil\u00edbrio e treino consistente.</p>' +
            "</div>" +
            '<div class="col-sm-6 col-lg-3">' +
            '<h4 class="site-footer-heading">Contato e informa\u00e7\u00f5es</h4>' +
            '<ul class="site-footer-list site-footer-list-compact">' +
            '<li><a href="' +
            config.whatsappUrl +
            '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(config.whatsappLabel) +
            "</a></li>" +
            '<li><a href="' +
            config.instagramUrl +
            '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(config.instagramLabel) +
            "</a></li>" +
            '<li><a href="' +
            config.facebookUrl +
            '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(config.facebookLabel) +
            "</a></li>" +
            "<li>PIX: " +
            escapeHtml(config.pixKey) +
            "</li>" +
            "</ul>" +
            "</div>" +
            '<div class="col-sm-6 col-lg-4">' +
            '<h4 class="site-footer-heading">Hor\u00e1rios e valores</h4>' +
            '<ul class="site-footer-facts">' +
            facts +
            "</ul>" +
            "</div>" +
            "</div>" +
            '<div class="site-footer-cta-row">' +
            '<a class="site-button site-button-primary" href="' +
            config.whatsappUrl +
            '" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>' +
            "</div>" +
            '<div class="site-footer-bottom">' +
            "<span>&copy; <span data-site-year></span> " +
            escapeHtml(config.siteName) +
            ".</span>" +
            "<span>Treino s\u00e9rio, conte\u00fado claro e professor dedicado.</span>" +
            "</div>" +
            "</div>" +
            "</footer>";

        var yearNode = container.querySelector("[data-site-year]");
        if (yearNode) {
            yearNode.textContent = new Date().getFullYear();
        }
    }

    onReady(function () {
        var config = window.SITE_CONFIG;
        if (!config) {
            return;
        }

        var body = document.body;
        var root = body.getAttribute("data-root") || "";
        var isHome = body.getAttribute("data-is-home") === "true";
        var currentPage = body.getAttribute("data-page") || "";

        ensureHeadAssets(root);
        renderHeader(config, root, isHome, currentPage);
        renderFooter(config);
        body.classList.add("site-shell-ready");
    });
})();
