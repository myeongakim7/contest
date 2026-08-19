$(function () {
  // const container = $(".card_ul");

  // const fixed = container.find(".fixed");
  // const cards = container.find(".card").not(".fixed");

  // const shuffled = cards.toArray().sort(() => Math.random() - 0.5);

  // container.empty();
  // container.append(fixed);
  // container.append(shuffled);

  // nav
  $(".hamburger").click(function () {
    $(".nav_wrap").toggleClass("on");
    $("body").toggleClass("on");
    $(this).toggleClass("on");
  });
  

  var msnry = new Masonry(".card_ul", {
    itemSelector: ".card",
    gutter: 40,
    // horizontalOrder: true,
  });

  // 카드 더보기 아이콘
  $(document).on("click", ".card_txt_box .icon_more", function () {
    $(this).siblings(".icon_trash").toggleClass("on");
    $(this).siblings(".icon_share").toggleClass("on");
  });

  function getKakaoJsKey() {
    return String(document.body.getAttribute("data-kakao-js-key") || "").trim();
  }

  function ensureKakaoInitialized() {
    const key = getKakaoJsKey();
    if (!key) {
      return false;
    }
    if (typeof Kakao === "undefined") {
      return false;
    }
    if (!Kakao.isInitialized()) {
      Kakao.init(key);
    }
    return true;
  }

  $('.pop_end').bPopup({
      modal: false
  });
  // 공유 버튼 — 카카오톡 공유(피드)
    /*$(document).on("click", ".card_txt_box .icon_share", function (e) {
        e.preventDefault();

        const $card = $(this).closest(".card");

        const entryIdx = Number($card.attr("data-entry-idx") || 0);
        if (!entryIdx) {
            return;
        }
        const shareUrl = new URL("/?entry=" + entryIdx, window.location.origin).href;
        if (!ensureKakaoInitialized()) {
            alert(
                "카카오 공유를 사용하려면 .env에 public.kakaoJavaScriptKey를 설정하고 도메인을 등록해주세요.",
            );
            return;
        }

        const title =
            String($card.attr("data-entry-share-title") || "").trim() ||
            "현대제철 공모전";

        const description =
            String($card.attr("data-entry-share-description") || "").trim() ||
            "현대제철 공모전 출품 작품을 확인해보세요.";

        let imageUrl = String($card.attr("data-entry-share-image") || "").trim();

        if (!imageUrl) {
            imageUrl = new URL("/images/logo.png", window.location.origin).href;
        }
        if (/^https?:\/\//i.test(imageUrl)) {
            try {
                const parsed = new URL(imageUrl);
                if (parsed.host !== window.location.host) {
                    imageUrl = new URL(parsed.pathname + parsed.search, window.location.origin).href;
                }
            } catch (e) {
                imageUrl = new URL("/images/logo.png", window.location.origin).href;
            }
        } else {
            imageUrl = new URL(imageUrl, window.location.origin).href;
        }

        const sendDefault =
            Kakao.Share && typeof Kakao.Share.sendDefault === "function"
                ? Kakao.Share.sendDefault.bind(Kakao.Share)
                : Kakao.Link && typeof Kakao.Link.sendDefault === "function"
                    ? Kakao.Link.sendDefault.bind(Kakao.Link)
                    : null;

        if (!sendDefault) {
            alert("카카오 공유 모듈을 찾을 수 없습니다.");
            return;
        }

        try {
          const shareResult = sendDefault({
            objectType: "feed",
            content: {
                title: title,
                description: description,
                imageUrl: imageUrl,
                link: {
                    mobileWebUrl: shareUrl,
                    webUrl: shareUrl,
                },
            },
          });
          if (shareResult && typeof shareResult.catch === "function") {
            shareResult.catch(function () {
              alert("카카오 공유를 열 수 없습니다. 잠시 후 다시 시도해주세요.");
            });
          }
        } catch (e) {
          alert("카카오 공유를 열 수 없습니다. 잠시 후 다시 시도해주세요.");
        }
    });*/
    $(document).on("click", ".card_txt_box .icon_share", function (e) {
        e.preventDefault();

        const $card = $(this).closest(".card");

        const entryIdx = Number($card.attr("data-entry-idx") || 0);
        if (!entryIdx) {
            alert("공유할 수 없는 항목입니다.");
            return;
        }

        const shareUrl = new URL("/share/" + entryIdx, window.location.origin).href;

        const $tempInput = $("<input>");
        $("body").append($tempInput);
        $tempInput.val(shareUrl).select();

        try {
            const success = document.execCommand("copy");
            if (success) {
                alert("작품 링크가 클립보드에 복사되었습니다!");
            } else {
                throw new Error();
            }
        } catch (err) {
            // Fallback: execCommand 실패 시 최신 API 시도
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert("작품 링크가 클립보드에 복사되었습니다!");
            }).catch(() => {
                alert("링크 복사에 실패했습니다. 주소를 직접 복사해주세요.");
            });
        }

        $tempInput.remove(); // 임시 요소 삭제
    });
  // var card = $(this).closest(".card");

  // msnry.remove(card[0]);
  // msnry.layout();

  // console.log("Card removed");

  function cardPopBOptions(card) {
    return {
      appendTo: card,
      positionStyle: "absolute",
      position: ["50%", "38px"],
      modal: false,
      follow: [false, false],
      focus: false,
    };
  }

  function closeCardPop($card, popSelector) {
    $card.find(popSelector + " .btn_close").first().trigger("click");
  }

  function openDeleteErrorModal(msg) {
    $(".alert_delete_error_msg").text(
      msg || "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    );
    $(".alert_delete_error").bPopup();
  }

  function showDeletePasswordInlineError(card, msg) {
    var $msg = card.find(".card_pop1 .delete_pw_error");
    $msg.text(msg || "비밀번호가 틀렸습니다.").addClass("on");
  }

  function clearDeletePasswordInlineError(card) {
    var $msg = card.find(".card_pop1 .delete_pw_error");
    $msg.removeClass("on").text("");
  }

  /** 비밀번호: ASCII 인쇄문자(공백~~)만, 정확히 6자 — 서버 `^[ -~]{6}$` 와 동일 */
  function sanitizeSixCharPrintableAscii(raw) {
    var s = String(raw || "");
    var out = "";
    for (var i = 0; i < s.length && out.length < 6; i++) {
      var c = s.charCodeAt(i);
      if (c >= 32 && c <= 126) {
        out += s.charAt(i);
      }
    }
    return out;
  }

  function isSixCharPrintableAscii(s) {
    return typeof s === "string" && /^[\u0020-\u007E]{6}$/.test(s);
  }

  // 등록폼 비밀번호: 영문·숫자 6자리(영문만·숫자만·혼합 모두 가능, 특수문자 제외)
  function sanitizeSixCharAlphaNum(raw) {
    var s = String(raw || "");
    var out = "";
    for (var i = 0; i < s.length && out.length < 6; i++) {
      var ch = s.charAt(i);
      if (/^[A-Za-z0-9]$/.test(ch)) {
        out += ch;
      }
    }
    return out;
  }

  function isSixCharAlphaNum(s) {
    return typeof s === "string" && /^[A-Za-z0-9]{6}$/.test(s);
  }

  function performDelete(card, entryIdx, password, $input) {
    $.ajax({
      url: "/entry/delete",
      type: "POST",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({
        entry_idx: entryIdx,
        password: password,
      }),
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .done(function (res) {
        if (res && res.success) {
          closeCardPop(card, ".card_pop1");
          window.setTimeout(function () {
            card.find(".card_pop3").bPopup($.extend({}, cardPopBOptions(card)));
          }, 0);
          return;
        }
        card.find(".card_pop1 .real_pswd").val("");
        showDeletePasswordInlineError(
          card,
          (res && res.message) || "비밀번호가 틀렸습니다.",
        );
      })
      .fail(function (xhr) {
        var payload = xhr.responseJSON || {};
        var wrong =
          xhr.status === 403 || payload.code === "WRONG_PASSWORD";
        if (wrong) {
          card.find(".card_pop1 .real_pswd").val("");
          showDeletePasswordInlineError(
            card,
            payload.message || "비밀번호가 틀렸습니다.",
          );
          return;
        }
        openDeleteErrorModal(
          payload.message ||
            "삭제 요청에 실패했습니다. 잠시 후 다시 시도해주세요.",
        );
      });
  }

  $(document).on("click", ".card_pop .btn_close", function () {
    var $pop = $(this).closest(".card_pop");
    $pop.find(".real_pswd").val("");
    $pop.find(".fake_pswd span").removeClass("on");
    clearDeletePasswordInlineError($pop.closest(".card"));
  });

  // 카드 삭제 시
  $(document).on("click", ".icon_trash", function () {
    const card = $(this).closest(".card");

    $("card").removeClass("active");
    $(this).parents(".card").addClass("active");

    card.find(".card_pop1").bPopup(
      $.extend({}, cardPopBOptions(card), {
        onOpen: function () {
          window.setTimeout(function () {
            var $p = card.find(".card_pop1 .real_pswd");
            $p.val("");
            clearDeletePasswordInlineError(card);
            $p.focus();
          }, 50);
        },
      }),
    );
  });

  // card_pop1 카드 비밀번호
  $(document).on("click", ".fake_pswd", function () {
    $(this).siblings(".real_pswd").focus();
  });

  $(document).on("input", ".real_pswd", function () {
    let len = $(this).val().length;
    console.log(len)

    $(this)
      .siblings(".fake_pswd")
      .find("span")
      .each(function (i) {
        $(this).toggleClass("on", i < len);
      });
    clearDeletePasswordInlineError($(this).closest(".card"));
  });
  
  $(document).on("click touchend", ".card_pop .btn_delete_submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $pop = $(this).closest(".card_pop");
    var $input = $pop.find(".real_pswd");
    var pwd = sanitizeSixCharPrintableAscii($input.val());
    $input.val(pwd);
    if (!isSixCharPrintableAscii(pwd)) {
      showDeletePasswordInlineError(
        $pop.closest(".card"),
        "비밀번호가 일치하지 않습니다.",
      );
      return;
    }
    var card = $pop.closest(".card");
    var entryIdx = Number(card.data("entry-idx"));
    if (!entryIdx) {
      showDeletePasswordInlineError(card, "잘못된 요청입니다.");
      return;
    }
    $(document).data("pendingDelete", {
      card: card,
      entryIdx: entryIdx,
      password: pwd,
      $input: $input,
    });
    $(".alert_delete_confirm").bPopup({
      onClose: function () {
        $(document).removeData("pendingDelete");
      },
    });
  });

  $(document).on("click", ".alert_delete_confirm .btn_delete_ok", function (e) {
    e.preventDefault();
    var p = $(document).data("pendingDelete");
    if (!p) {
      return;
    }
    $(document).removeData("pendingDelete");
    $(".alert_delete_confirm .btn_close").first().trigger("click");
    performDelete(p.card, p.entryIdx, p.password, p.$input);
  });

  // 카드 삭제 확인 모달: 취소·닫기 시 입력 비우기
  $(document).on("click", ".alert_delete_confirm .b-close", function () {
    var p = $(document).data("pendingDelete");
    if (p && p.$input && p.$input.length) {
      p.$input.val("");
    }
    $(document).removeData("pendingDelete");
  });

  // card_pop3 삭제 완료 후 닫기 → 카드 제거
  $(document).on("click", ".card_pop3 .btn_close", function () {
    var card = $(this).closest(".card");
    msnry.remove(card[0]);
    msnry.layout();
    console.log("Card removed");
  });

  // $(".nav-menu-btn .nav-btn");
  $(document).on("click", ".card .like", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (String(document.body.getAttribute("data-contest-period-active") || "") !== "1") {
      return;
    }
    const $like = $(this);
    if ($like.hasClass("like--disabled")) {
      return;
    }
    const idx = Number($like.data("entry-idx"));
    if (!idx) {
      return;
    }
    $.ajax({
      url: "/entry/like",
      type: "POST",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ entry_idx: idx }),
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .done(function (res) {
        if (!res || !res.success) {
          return;
        }
        $like.text(res.like_count);
        $like.toggleClass("on", !!res.liked);
        $like.attr("data-liked", res.liked ? "1" : "0");
      })
      .fail(function () {
        /* noop */
      });
  });

  const PUBLIC_ENTRY_LIMIT = 16;
  const $moreWrap = $(".btn_wrap");
  const $moreBtn = $(".btn_more");
  const $excludeInput = $("#entry_exclude_ids");
  const $categoryInput = $("#entry_current_category_idx");
  let currentRequest = null;
  let requestSeq = 0;

  function animateCards($cards) {
    $cards.each(function (idx) {
      const el = this;
      setTimeout(function () {
        $(el).addClass("is-visible");
        msnry.layout();
      }, Math.min(idx * 45, 400));
    });
  }

  function mergeExcludeIds(prevCsv, batchIdxs) {
    const set = new Set();
    String(prevCsv || "")
      .split(",")
      .forEach(function (s) {
        const n = parseInt(String(s).trim(), 10);
        if (n > 0) set.add(n);
      });
    if (Array.isArray(batchIdxs)) {
      batchIdxs.forEach(function (n) {
        const v = parseInt(n, 10);
        if (v > 0) set.add(v);
      });
    }
    return Array.from(set)
      .sort(function (a, b) {
        return a - b;
      })
      .join(",");
  }

  function updatePaginationState(response) {
    const prev = String($excludeInput.val() || "").trim();
    $excludeInput.val(mergeExcludeIds(prev, response.batch_idxs));
    if (response.hasMore) {
      $moreWrap.show();
    } else {
      $moreWrap.hide();
    }
  }

  function getSearchQuery() {
    return String($(".search_box input[name='search']").val() || "").trim();
  }

  function requestEntries(options) {
    const reset = !!options.reset;
    const categoryIdx = options.categoryIdx || 0;
    const requestId = ++requestSeq;
    const search = options.search !== undefined ? options.search : getSearchQuery();

    if (!reset && $moreBtn.data("loading")) return;

    if (reset) {
      if (currentRequest && typeof currentRequest.abort === "function") {
        currentRequest.abort();
      }

      const $existing = $(".card_ul .entry-card");
      msnry.remove($existing.get());
      $existing.remove();
      msnry.layout();
      $moreWrap.show();
      $excludeInput.val("");
    }

    const exclude = String($excludeInput.val() || "").trim();

    $moreBtn.data("loading", true).text("불러오는 중...");

    currentRequest = $.ajax({
      url: "/entry/list",
      type: "POST",
      data: {
        category_idx: categoryIdx || "",
        exclude: exclude,
        limit: PUBLIC_ENTRY_LIMIT,
        search: search,
      },
      success: function (response) {
        if (requestId !== requestSeq) return;
        if (!response || !response.success) return;

        const $items = $(response.html || "");
        if ($items.length) {
          $(".card_ul").append($items);
          msnry.appended($items.get());
        }

        $items.find("img").on("load error", function () {
          msnry.layout();
        });
        animateCards($items);
        updatePaginationState(response);
        msnry.layout();
      },
      complete: function () {
        if (requestId !== requestSeq) return;
        currentRequest = null;
        $moreBtn.data("loading", false).text("더보기");
      },
    });
  }

  animateCards($(".card_ul .entry-card"));

  $(".tab_ul > li a").click(function () {
    $('input[name="search"]').val("");
    $(".tab_ul > li a").removeClass("on");
    $(this).addClass("on");
    const categoryKey = $(this).data("category");
    const categoryIdx = String(categoryKey).startsWith("category-")
      ? Number(String(categoryKey).replace("category-", ""))
      : 0;
    $categoryInput.val(categoryIdx || 0);
    $(".search_box form input[name='category']").val(categoryKey || "all");
    requestEntries({ reset: true, categoryIdx: categoryIdx || 0, search: getSearchQuery() });

    const $numLis = $(".card_num_ul > li");
    $numLis.removeClass("on");
    const ck = categoryKey || "all";
    if (ck === "all") {
      $numLis.filter('[data-category="all"]').addClass("on");
    } else {
      $numLis.filter('[data-category="' + ck + '"]').addClass("on");
    }
  });

  /** 모바일 메인(m_index)은 `.pop` 없음 — `href="/mobile/form"` 그대로 이동해야 함 */
  (function () {
    if (!$(".pop").length) {
      return;
    }

  function isContestEntryOpen() {
    return String(document.body.getAttribute("data-contest-entry-open") || "") === "1";
  }

  function isContestPeriodActive() {
    return String(document.body.getAttribute("data-contest-period-active") || "") === "1";
  }

  function canShowParticipate() {
    return String(document.body.getAttribute("data-show-participate") || "") === "1";
  }

  /** PC 출품 등록 — 페이지 이동 없이 `.pop` 레이어(bPopup) */
  function openContestEntryPop() {
      $(".pop").bPopup();

    // if (canShowParticipate()) {
    //   $(".pop").bPopup();
    //   return;
    // }
    // if (!isContestPeriodActive()) {
    //   alert("공모전이 종료되어 참여할 수 없습니다.");
    //   return;
    // }
    // alert("접수는 2026년 4월 6일부터 시작됩니다.");
  }
  window.openContestEntryPop = openContestEntryPop;

  function resetContestEntryPopForm($form) {
    if (!$form || !$form.length) return;
    $form[0].reset();
    $("#input_phone").val("");
    $(".pop .pop_inner .radio_wrap .radio_box label").removeClass("on");
    const firstCategoryText = $(".pop .select_ul li button").first().text();
    if (firstCategoryText) {
      $(".pop .select_box .select_btn").text(firstCategoryText);
    }
    $(".pop .pop_inner .input_box .photo").first().text(
      "drag & drop / 이미지 파일 크기 제한 : 10MB(JPG, PNG)",
    );
  }

  function focusContestEntryFieldPop($form, fieldName) {
    switch (fieldName) {
      case "category_idx":
        $form.find(".select_box .select_btn").focus();
        break;
      case "title":
        $form.find("#input_title").focus();
        break;
      case "content":
        $form.find("#input_text").focus();
        break;
      case "name":
        $form.find("#input_name").focus();
        break;
      case "phone":
        $form.find("#input_phone").focus();
        break;
      case "password":
        $form.find("#input_pswd").focus();
        break;
      case "consent":
        $form.find("input[name='consent'][value='Y']").focus();
        break;
      case "award_use_consent":
        $form.find("input[name='award_use_consent'][value='Y']").focus();
        break;
      case "photo":
        $form.find("#input_photo").focus();
        break;
      default:
        break;
    }
  }

  /** 등록폼 필수값: 화면 위→아래 순서로 검사 */
  function validateContestEntryPopRequired($form) {
    var categoryIdx = Number($form.find("#input_category_idx").val() || 0);
    var title = String($form.find("#input_title").val() || "").trim();
    var content = String($form.find("#input_text").val() || "").trim();
    var name = String($form.find("#input_name").val() || "").trim();
    var phone = String($form.find("#input_phone").val() || "").trim();
    var password = String($form.find("#input_pswd").val() || "").trim();
    var consent = String(
      $form.find("input[name='consent']:checked").val() || "",
    );
    var awardUseConsent = String(
      $form.find("input[name='award_use_consent']:checked").val() || "",
    );

    if (!categoryIdx) {
      $(".alert1_5").bPopup();
      $form.find(".select_box .select_btn").focus();
      return false;
    }
    if (!title) {
      $(".alert1_1").bPopup();
      $form.find("#input_title").focus();
      return false;
    }
    if (!content) {
      $(".alert1_2").bPopup();
      $form.find("#input_text").focus();
      return false;
    }
    if (!name) {
      $(".alert1_3").bPopup();
      $form.find("#input_name").focus();
      return false;
    }
    if (!phone) {
      $(".alert1_4").bPopup();
      $form.find("#input_phone").focus();
      return false;
    }
    if (!password) {
      $(".alert6").bPopup();
      $form.find("#input_pswd").focus();
      return false;
    }
    if (!isSixCharAlphaNum(password)) {
      $(".alert6").bPopup();
      $form.find("#input_pswd").focus();
      return false;
    }
    if (consent !== "Y" && awardUseConsent !== "Y") {
      $(".alert2_both").bPopup();
      $form.find("input[name='consent']").first().focus();
      return false;
    }
    if (consent !== "Y") {
      $(".alert2").bPopup();
      $form.find("input[name='consent']").first().focus();
      return false;
    }
    if (awardUseConsent !== "Y") {
      $(".alert2_award").bPopup();
      $form.find("input[name='award_use_consent']").first().focus();
      return false;
    }

    return true;
  }

  $("#input_photo").change(function () {
    var filename = this.files[0]?.name;
    var $photo = $(".pop .pop_inner .input_box .photo").first();
    if (filename) {
      $photo.text(filename);
    } else {
      $photo.text(
        "drag & drop / 이미지 파일 크기 제한 : 10MB(JPG, PNG)",
      );
    }
  });

  function syncPopConsentRadioLabels() {
    $(".pop .pop_inner form .radio_wrap").each(function () {
      var $wrap = $(this);
      $wrap.find(".radio_box label").removeClass("on");
      var $checked = $wrap.find("input[type='radio']:checked");
      if ($checked.length) {
        $checked.siblings("label").addClass("on");
      }
    });
  }

  $(".pop .pop_inner .radio_wrap .radio_box input[type='radio']").change(
    function () {
      var $wrap = $(this).closest(".radio_wrap");
      $wrap.find(".radio_box label").removeClass("on");
      $(this).siblings("label").addClass("on");
    },
  );

  syncPopConsentRadioLabels();

  $("#input_phone").on("input", function () {
    const digits = String($(this).val()).replace(/\D/g, "").slice(0, 11);
    $(this).val(digits);
  });

  $("#input_phone").on("paste", function (e) {
    e.preventDefault();
    const text = (
      e.originalEvent.clipboardData || window.clipboardData
    ).getData("text");
    const digits = String(text).replace(/\D/g, "").slice(0, 11);
    $(this).val(digits);
  });

  $(".pop").on("input", "#input_pswd", function () {
    $(this).val(sanitizeSixCharAlphaNum($(this).val()));
  });

  $(".pop").on("paste", "#input_pswd", function (e) {
    e.preventDefault();
    var text = (
      e.originalEvent.clipboardData || window.clipboardData
    ).getData("text");
    $(this).val(sanitizeSixCharAlphaNum(text));
  });

  $(".pop .select_box .select_btn").click(function (e) {
    e.preventDefault();
    $(".pop .select_ul").toggleClass("on");
  });

  $(".pop .select_ul li button").click(function () {
    var itemVal = $(this).val();
    var itemText = $(this).text();
    $(".pop .select_box .select_btn").text(itemText);
    $("#input_category_idx").val(itemVal);
    $(".pop .select_ul").removeClass("on");
  });

  $(".floating_wrap .writing, .header_box .btn, .card.fixed .btn_wrap .btn").on(
    "click",
    function (e) {
      e.preventDefault();
      openContestEntryPop();
    },
  );

  $(".pop > .btn_close.b-close").on("click", function () {
    resetContestEntryPopForm($(".pop .pop_inner form"));
  });

  $(".pop .pop_inner form").on("submit", function (e) {
    e.preventDefault();

    const $form = $(this);
    $form
      .find("#input_title")
      .val(String($form.find("#input_title").val() || "").trim());
    $form
      .find("#input_text")
      .val(String($form.find("#input_text").val() || "").trim());
    $form
      .find("#input_name")
      .val(String($form.find("#input_name").val() || "").trim());
    $form
      .find("#input_phone")
      .val(
        String($form.find("#input_phone").val() || "")
          .replace(/\D/g, "")
          .slice(0, 11),
      );
    $form
      .find("#input_pswd")
      .val(sanitizeSixCharAlphaNum($form.find("#input_pswd").val()));

    if (!validateContestEntryPopRequired($form)) {
      return;
    }

    const formData = new FormData(this);
    const $submitBtn = $form.find(".btn_submit");

    $submitBtn.prop("disabled", true);

    $.ajax({
      url: $form.attr("action"),
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      success: function () {
        $(".pop .btn_close.b-close").trigger("click");
        $(".alert3").bPopup();
        resetContestEntryPopForm($form);
      },
      error: function (xhr) {
        const $form = $(".pop .pop_inner form");
        const response = xhr.responseJSON || {};
        const code = response.code || "";
        const errors = response.errors || {};

        if (code === "ENTRY_NOT_OPEN") {
          alert(response.message || "접수는 2026년 4월 6일부터 시작됩니다.");
          return;
        }

        if (code === "DUPLICATE") {
          $(".alert5").bPopup();
          return;
        }

        if (code === "VALIDATION_ERROR") {
          var order = [
            "category_idx",
            "title",
            "content",
            "name",
            "phone",
            "password",
            "consent",
            "award_use_consent",
            "photo",
          ];
          var first =
            response.firstField ||
            (function () {
              for (var i = 0; i < order.length; i++) {
                if (errors[order[i]]) {
                  return order[i];
                }
              }
              return null;
            })();
          if (first === "password" && errors.password) {
            var pwErr = errors.password;
            var msg =
              typeof pwErr === "string"
                ? pwErr
                : Array.isArray(pwErr) && pwErr[0]
                  ? pwErr[0]
                  : "입력값을 확인해주세요.";
            $(".alert_delete_error_msg").text(msg);
            $(".alert_delete_error").bPopup();
            focusContestEntryFieldPop($form, "password");
            return;
          }
          if (first) {
            focusContestEntryFieldPop($form, first);
            if (errors.consent && errors.award_use_consent) {
              $(".alert2_both").bPopup();
            } else if (first === "consent") {
              $(".alert2").bPopup();
            } else if (first === "award_use_consent") {
              $(".alert2_award").bPopup();
            } else if (first === "photo") {
              $(".alert4").bPopup();
            } else {
              $(".alert1").bPopup();
            }
          } else {
            $(".alert1").bPopup();
          }
          return;
        }

        if (code === "PHOTO_ERROR" || errors.photo) {
          $(".alert4").bPopup();
          focusContestEntryFieldPop($form, "photo");
          return;
        }

        if (errors.consent && errors.award_use_consent) {
          $(".alert2_both").bPopup();
          focusContestEntryFieldPop($form, "consent");
          return;
        }

        if (errors.consent) {
          $(".alert2").bPopup();
          focusContestEntryFieldPop($form, "consent");
          return;
        }

        if (errors.award_use_consent) {
          $(".alert2_award").bPopup();
          focusContestEntryFieldPop($form, "award_use_consent");
          return;
        }

        if (errors.password) {
          var pwErr2 = errors.password;
          var msg2 =
            typeof pwErr2 === "string"
              ? pwErr2
              : Array.isArray(pwErr2) && pwErr2[0]
                ? pwErr2[0]
                : "입력값을 확인해주세요.";
          $(".alert_delete_error_msg").text(msg2);
          $(".alert_delete_error").bPopup();
          focusContestEntryFieldPop($form, "password");
          return;
        }

        var order2 = [
          "category_idx",
          "title",
          "content",
          "name",
          "phone",
        ];
        for (var j = 0; j < order2.length; j++) {
          if (errors[order2[j]]) {
            focusContestEntryFieldPop($form, order2[j]);
            $(".alert1").bPopup();
            return;
          }
        }

        $(".alert1").bPopup();
      },
      complete: function () {
        $submitBtn.prop("disabled", false);
      },
    });
  });

  })();

  $(document).on("input", ".card_pop .real_pswd", function () {
    $(this).val(sanitizeSixCharPrintableAscii($(this).val()));
  });

  $(".floating_wrap .page_up").click(function () {
    $('html, body').animate({scrollTop: 0}, 500)
  });

  $(".btn_more").on("click", function () {
    requestEntries({
      reset: false,
      categoryIdx: Number($categoryInput.val() || 0),
      search: getSearchQuery(),
    });
  });

})
