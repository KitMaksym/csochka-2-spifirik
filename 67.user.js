// ==UserScript==
// @name         этот спуфер для кс2 короч
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  УСТАНОВИ ПОЖАЛУСТА Я ПОТРАТИЛ 10 МИНУТ СВОЕГО ВРЕМЕНИ
// @author       ya
// @match        https://fungun.net/ecd/report/*
// @match        https://fungun.net/ecd/list/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const path = window.location.pathname;
    const isReportPage = path.includes('/ecd/report/');
    const isListPage = path.includes('/ecd/list');

    const match = path.match(/\/ecd\/report\/(\d+)/);
    const reportId = match ? match[1] : '';

    function processMutations() {
        if (isReportPage) {
            cleanReportFast();
        } else if (isListPage) {
            cleanListFast();
        }
    }

    function cleanReportFast() {
        document.querySelectorAll('[data-detect]').forEach(el => {
            if (el.style.display !== 'none') el.style.display = 'none';
        });

        const statusDiv = document.querySelector('.result-status');
        if (statusDiv && statusDiv.getAttribute('data-status') !== 'success') {
            statusDiv.setAttribute('data-status', 'success');

            const icon = statusDiv.querySelector('i');
            if (icon) icon.className = 'fa fa-check-square text-success';

            const text = statusDiv.querySelector('span[data-result_status]');
            if (text) {
                text.className = 'text-success';
                text.setAttribute('data-result_status', 'success');
                text.textContent = 'Чисто';
            }

            const removeLink = statusDiv.querySelector('.remove-link');
            if (removeLink) removeLink.style.display = 'none';
        }

        const cheatTable = document.querySelector('#ecd-report-cheats');
        if (cheatTable && !cheatTable.querySelector('.cleaned-marker')) {
            cheatTable.querySelectorAll('tbody').forEach(tb => tb.remove());

            const newTbody = document.createElement('tbody');
            newTbody.className = 'cleaned-marker';
            newTbody.innerHTML = '<tr><td colspan="3" style="padding:15px"><i class="fa fa-check-square text-success"></i> Не найдено читов</td></tr>';
            cheatTable.appendChild(newTbody);
        }

        const summary = document.querySelector('.summary');
        if (summary && !summary.querySelector('.badge-success')) {
            const darkBadge = summary.querySelector('.badge-dark');
            const total = darkBadge ? darkBadge.textContent.trim() : '1';
            summary.innerHTML = '<span class="badge badge-success">' + total + '</span>';
        }

        if (document.title.match(/⚠️|🔴|🟡|🔵|⚪/)) {
            document.title = document.title.replace(/⚠️|🔴|🟡|🔵|⚪/g, '✅');
        }
        const h1 = document.querySelector('h1');
        if (h1 && h1.innerHTML.match(/⚠️|🔴|🟡|🔵|⚪/)) {
            h1.innerHTML = h1.innerHTML.replace(/⚠️|🔴|🟡|🔵|⚪/g, '✅');
        }

        const reportsBody = document.querySelector('#ecd-reports tbody');
        if (reportsBody && !reportsBody.querySelector('.cleaned-row')) {
            const playerNick = document.querySelector('.nick')?.textContent?.trim() || 'Player';
            const playerIP = document.querySelector('.user_ip')?.textContent?.trim() || '-';
            const timeCells = document.querySelectorAll('#ecd-report-right td[title]');
            const gameTime = timeCells.length > 0 ? timeCells[0].textContent.trim() : '';

            reportsBody.innerHTML =
                '<tr role="row" class="cleaned-row">' +
                '<td class="nick"><img width="24" height="24" src="/ecd/img/cs2.png"> <a href="/ecd/report/' + reportId + '/">' + playerNick + '</a></td>' +
                '<td class="user_ip">' + playerIP + '</td>' +
                '<td class="hostname">-</td>' +
                '<td class="result_status"><i class="fa fa-check-square text-success"></i> <span class="text-success">Чисто</span></td>' +
                '<td class="before">Нет</td>' +
                '<td class="time">' + gameTime + '</td>' +
                '<td class="more"><a href="/ecd/report/' + reportId + '/" class="btn btn-success">Подробнее</a></td>' +
                '</tr>';
        }

        const info = document.querySelector('#ecd-reports_info');
        if (info && info.textContent !== 'Показано 1 из 1 отчетов') {
            info.textContent = 'Показано 1 из 1 отчетов';
        }

        ['og:title', 'twitter:title', 'vk:title'].forEach(prop => {
            const meta = document.querySelector('meta[property="' + prop + '"]');
            if (meta && !meta.getAttribute('content').includes('✅')) {
                meta.setAttribute('content', meta.getAttribute('content').replace(/⚠️|🔴|🟡|🔵|⚪/g, '✅'));
            }
        });
    }

    function cleanListFast() {
        document.querySelectorAll('#ecd-reports .result_status').forEach(cell => {
            const span = cell.querySelector('span[data-result_status]');
            if (span && span.textContent !== 'Чисто') {
                span.className = 'text-success';
                span.textContent = 'Чисто';
            }
            const icon = cell.querySelector('i');
            if (icon && !icon.classList.contains('text-success')) {
                icon.className = 'fa fa-check-square text-success';
            }
        });

        document.querySelectorAll('#ecd-reports .btn-danger, #ecd-reports .btn-warning').forEach(btn => {
            btn.classList.remove('btn-danger', 'btn-warning');
            btn.classList.add('btn-success');
        });
    }

    const observer = new MutationObserver(processMutations);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('DOMContentLoaded', processMutations);
    window.addEventListener('load', processMutations);

})();
