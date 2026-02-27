/**
 * Vivly Living — Interactive Site Map
 * Professional site plan with hover/tap tooltips
 */
(function () {
    'use strict';

    // Plot data for Knowle Grange
    const PLOTS = {
        1: { name: 'The Wisteria', beds: 4, type: 'Detached', price: '£435,000', status: 'available', img: 'images/house4.webp' },
        2: { name: 'The Wisteria', beds: 4, type: 'Detached', price: '£435,000', status: 'available', img: 'images/house4.webp' },
        3: { name: 'The Birch', beds: 3, type: 'Semi-Detached', price: '£345,000', status: 'sold', img: 'images/house2.webp' },
        4: { name: 'The Birch', beds: 3, type: 'Semi-Detached', price: '£345,000', status: 'sold', img: 'images/house2.webp' },
        5: { name: 'The Sessile', beds: 2, type: 'Semi-Detached', price: '£275,000', status: 'reserved', img: 'images/house1.webp' },
        6: { name: 'The Sessile', beds: 2, type: 'Semi-Detached', price: '£275,000', status: 'sold', img: 'images/house1.webp' },
        7: { name: 'The Birch', beds: 3, type: 'Semi-Detached', price: '£349,000', status: 'available', img: 'images/house2.webp' },
        8: { name: 'The Birch', beds: 3, type: 'Semi-Detached', price: '£349,000', status: 'available', img: 'images/house2.webp' },
        12: { name: 'The Wisteria', beds: 4, type: 'Detached', price: '£445,000', status: 'available', img: 'images/house4.webp' },
        13: { name: 'The Birch', beds: 3, type: 'Semi-Detached', price: '£350,000', status: 'available', img: 'images/house2.webp' },
        14: { name: 'The Birch', beds: 3, type: 'Semi-Detached', price: '£350,000', status: 'reserved', img: 'images/house2.webp' },
        15: { name: 'The Sessile', beds: 2, type: 'Semi-Detached', price: '£279,000', status: 'available', img: 'images/house1.webp' },
        16: { name: 'The Sessile', beds: 2, type: 'Semi-Detached', price: '£279,000', status: 'available', img: 'images/house1.webp' },
        17: { name: 'The Rowan', beds: 3, type: 'Detached', price: '£380,000', status: 'available', img: 'images/house3.webp' },
        18: { name: 'The Wisteria', beds: 4, type: 'Detached', price: '£450,000', status: 'available', img: 'images/house4.webp' },
        19: { name: 'The Birch', beds: 3, type: 'Semi-Detached', price: '£340,000', status: 'sold', img: 'images/house2.webp' },
        21: { name: 'The Sessile', beds: 2, type: 'Semi-Detached', price: '£270,000', status: 'available', img: 'images/house1.webp' },
        23: { name: 'The Rowan', beds: 3, type: 'Detached', price: '£378,000', status: 'available', img: 'images/house3.webp' },
        25: { name: 'The Wisteria', beds: 4, type: 'Detached', price: '£455,000', status: 'available', img: 'images/house4.webp' },
        26: { name: 'The Sessile', beds: 2, type: 'Semi-Detached', price: '£268,000', status: 'available', img: 'images/house1.webp' }
    };

    // Status labels
    const STATUS_LABELS = {
        available: 'Available',
        reserved: 'Reserved',
        sold: 'Sold'
    };

    // Create tooltip element
    function createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'sitemap-tooltip';
        tooltip.innerHTML = `
            <div class="sitemap-tooltip__card">
                <div class="sitemap-tooltip__arrow"></div>
                <button class="sitemap-tooltip__close" aria-label="Close">&times;</button>
                <img class="sitemap-tooltip__img" src="" alt="" />
                <div class="sitemap-tooltip__body">
                    <div class="sitemap-tooltip__plot"></div>
                    <div class="sitemap-tooltip__name"></div>
                    <div class="sitemap-tooltip__badge"></div>
                    <div class="sitemap-tooltip__details"></div>
                    <div class="sitemap-tooltip__price"></div>
                    <a href="contact.html" class="sitemap-tooltip__link">
                        Enquire <span>→</span>
                    </a>
                </div>
            </div>
        `;
        return tooltip;
    }

    // Set tooltip content
    function populateTooltip(tooltip, plotId, data) {
        tooltip.querySelector('.sitemap-tooltip__plot').textContent = `Plot ${plotId}`;
        tooltip.querySelector('.sitemap-tooltip__name').textContent = data.name;
        tooltip.querySelector('.sitemap-tooltip__details').textContent =
            `${data.beds} Bedroom ${data.type}`;
        tooltip.querySelector('.sitemap-tooltip__price').textContent = data.price;

        const badge = tooltip.querySelector('.sitemap-tooltip__badge');
        badge.textContent = STATUS_LABELS[data.status];
        badge.className = `sitemap-tooltip__badge sitemap-tooltip__badge--${data.status}`;

        const link = tooltip.querySelector('.sitemap-tooltip__link');
        link.style.display = data.status === 'sold' ? 'none' : '';

        const img = tooltip.querySelector('.sitemap-tooltip__img');
        img.src = data.img;
        img.alt = data.name;
    }

    // Position tooltip relative to the map area — viewport-aware
    function positionTooltip(tooltip, plotEl, container) {
        const plotRect = plotEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const tooltipHeight = tooltip.offsetHeight;
        const tooltipWidth = tooltip.offsetWidth || 260;

        const plotCenterX = plotRect.left + plotRect.width / 2 - containerRect.left;
        const plotTopY = plotRect.top - containerRect.top;
        const plotBottomY = plotRect.bottom - containerRect.top;

        // Check space both within container AND viewport
        const spaceAboveInViewport = plotRect.top;
        const spaceBelowInViewport = window.innerHeight - plotRect.bottom;
        const spaceAboveInContainer = plotTopY;

        let left = plotCenterX - (tooltipWidth / 2);
        const arrow = tooltip.querySelector('.sitemap-tooltip__arrow');

        let top;
        // Prefer above; only go below if truly no room above AND room below
        if (spaceAboveInContainer >= tooltipHeight + 14 && spaceAboveInViewport >= tooltipHeight + 14) {
            // Show above the plot
            top = plotTopY - tooltipHeight - 10;
            tooltip.classList.remove('sitemap-tooltip--below');
            arrow.style.top = '';
            arrow.style.bottom = '-6px';
        } else if (spaceBelowInViewport >= tooltipHeight + 14) {
            // Show below the plot (only if room in viewport)
            top = plotBottomY + 10;
            tooltip.classList.add('sitemap-tooltip--below');
            arrow.style.bottom = '';
            arrow.style.top = '-6px';
        } else {
            // Neither fits perfectly — show above and clamp to top of container
            top = Math.max(5, plotTopY - tooltipHeight - 10);
            tooltip.classList.remove('sitemap-tooltip--below');
            arrow.style.top = '';
            arrow.style.bottom = '-6px';
        }

        // Clamp horizontal to container bounds
        const maxLeft = containerRect.width - tooltipWidth - 5;
        left = Math.max(5, Math.min(left, maxLeft));

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    // Initialize each site map
    function initSiteMap(sitemapEl) {
        const mapArea = sitemapEl.querySelector('.sitemap__map-area');
        if (!mapArea) return;

        const tooltip = createTooltip();
        mapArea.appendChild(tooltip);

        const plots = sitemapEl.querySelectorAll('.plot[data-plot]');
        let activeTooltip = null;
        let hoverLocked = false; // prevent re-trigger during animation
        const isTouchDevice = 'ontouchstart' in window;

        function showTooltip(plotEl) {
            if (hoverLocked) return;
            const plotId = parseInt(plotEl.dataset.plot);
            const data = PLOTS[plotId];
            if (!data) return;

            populateTooltip(tooltip, plotId, data);
            tooltip.classList.add('sitemap-tooltip--visible');

            // Position after making visible so we can measure
            hoverLocked = true;
            requestAnimationFrame(() => {
                positionTooltip(tooltip, plotEl, mapArea);
                hoverLocked = false;
            });

            activeTooltip = plotEl;
        }

        function hideTooltip() {
            tooltip.classList.remove('sitemap-tooltip--visible');
            activeTooltip = null;
        }

        plots.forEach(plot => {
            if (isTouchDevice) {
                // Track touch position to distinguish taps from swipes
                let touchStartX = 0;
                let touchStartY = 0;

                plot.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }, { passive: true });

                plot.addEventListener('touchend', (e) => {
                    const touch = e.changedTouches[0];
                    const dx = Math.abs(touch.clientX - touchStartX);
                    const dy = Math.abs(touch.clientY - touchStartY);

                    // Only treat as a tap if finger barely moved (< 10px)
                    if (dx < 10 && dy < 10) {
                        e.preventDefault();
                        if (activeTooltip === plot) {
                            hideTooltip();
                        } else {
                            showTooltip(plot);
                        }
                    }
                    // Otherwise it was a swipe — let it scroll naturally
                });
            } else {
                plot.addEventListener('mouseenter', () => showTooltip(plot));
                plot.addEventListener('mouseleave', () => hideTooltip());
            }

            // Keyboard accessibility
            plot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (activeTooltip === plot) {
                        hideTooltip();
                    } else {
                        showTooltip(plot);
                    }
                }
                if (e.key === 'Escape') {
                    hideTooltip();
                }
            });
        });

        // Close button handler (for touch devices)
        const closeBtn = tooltip.querySelector('.sitemap-tooltip__close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideTooltip();
        });
        closeBtn.addEventListener('touchend', (e) => {
            e.stopPropagation();
            e.preventDefault();
            hideTooltip();
        });

        // Dismiss on click outside
        document.addEventListener('click', (e) => {
            if (activeTooltip && !tooltip.contains(e.target) && !e.target.closest('.plot')) {
                hideTooltip();
            }
        });

        // Key item hover highlights
        const keyItems = sitemapEl.querySelectorAll('.sitemap__key-item');
        keyItems.forEach((item, index) => {
            const bedTypes = ['4bed', '3bed', '3bed', '2bed'];
            const bedClass = bedTypes[index];

            item.addEventListener('mouseenter', () => {
                plots.forEach(plot => {
                    if (!plot.classList.contains(`plot--${bedClass}`)) {
                        plot.style.opacity = '0.25';
                    }
                });
            });

            item.addEventListener('mouseleave', () => {
                plots.forEach(plot => {
                    plot.style.opacity = '';
                });
            });
        });
    }

    // Init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        document.querySelectorAll('.sitemap').forEach(initSiteMap);
    }
})();
