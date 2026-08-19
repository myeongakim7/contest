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

  function isContestEntryOpen() {
    return String(document.body.getAttribute("data-contest-entry-open") || "") === "1";
  }

  $(document).on("click", 'a[href="/mobile/form"]', function (e) {
    if (!isContestEntryOpen()) {
      e.preventDefault();
      alert("접수는 2026년 4월 6일부터 시작됩니다.");
    }
  });
  
  $(".pop_end").bPopup({
    modal: false,
  });


  function createMasonryInstance() {
    if (typeof Masonry !== "function") {
      return {
        remove: function () {},
        layout: function () {},
        appended: function () {},
      };
    }
    return new Masonry(".card_ul", {
      itemSelector: ".card",
      gutter: 40,
      // horizontalOrder: true,
    });
  }

  var msnry = createMasonryInstance();

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
    $(document).on("click", ".card_txt_box .icon_share", function (e) {
        e.preventDefault();

        const $card = $(this).closest(".card");

        const entryIdx = Number($card.attr("data-entry-idx") || 0);
        if (!entryIdx) {
            alert("공유할 수 없는 항목입니다.");
            return;
        }

        // 복사할 최종 URL 조합
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
  // 카드 개별 공유 버튼 — 카카오톡 공유
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

  // 플로팅 공유 버튼(.sharing) — 현재 페이지 카카오 공유
  $(".sharing").on("click", function (e) {
    e.preventDefault();
    // if (!ensureKakaoInitialized()) {
    //   alert(
    //     "카카오 공유를 사용하려면 .env에 public.kakaoJavaScriptKey를 설정하고 도메인을 등록해주세요.",
    //   );
    //   return;
    // }
      const url = window.location.href;

      const $tempInput = $("<input>"); // 임시 input 생성
      $("body").append($tempInput);    // 본문에 추가
      $tempInput.val(url).select();    // 값 넣고 선택하기

      try {
          document.execCommand("copy"); // 복사 실행
          alert("링크가 복사되었습니다!");
      } catch (err) {
          alert("복사에 실패했습니다.");
      }

      $tempInput.remove(); // 사용한 임시 input 제거
    /*const title = document.title || "현대제철 공모전";
    const description = "현대제철 공모전 페이지를 확인해보세요.";
    const imageUrl = new URL("/images/logo.png", window.location.origin).href;

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
    } catch (e2) {
      alert("카카오 공유를 열 수 없습니다. 잠시 후 다시 시도해주세요.");
    }*/
  });

  // var card = $(this).closest(".card");

  // msnry.remove(card[0]);
  // msnry.layout();

  // console.log("Card removed");

  // 카드 삭제 시
  $(document).on("click", ".icon_trash", function () {
    const card = $(this).closest(".card");

    $("card").removeClass("active");
    $(this).parents(".card").addClass("active");

    card.find(".card_pop1").bPopup({
      appendTo: card, // 🔥 핵심: 카드 안으로 넣기
      positionStyle: "absolute", // 카드 기준으로 위치
      position: ["50%", "38px"], // 카드 기준 좌표
      modal: false, // 🔥 배경 dim 제거
      follow: [false, false], // 🔥 스크롤 따라다니는거 방지
      focus: false,

      onOpen: function () {
        setTimeout(() => {
          clearDeletePasswordInlineError(card);
          card.find(".real_pswd").focus();
        }, 50);
      },
    });
  });
  // card_pop1 카드 비밀번호
  $(document).on("click", ".fake_pswd", function () {
    $(this).siblings(".real_pswd").focus();
  });

  $(document).on("input", ".real_pswd", function () {
    let len = $(this).val().length;

    $(this)
      .siblings(".fake_pswd")
      .find("span")
      .each(function (i) {
        $(this).toggleClass("on", i < len);
      });
  });

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
          card.find(".card_pop1 .btn_close").first().trigger("click");
          window.setTimeout(function () {
            card.find(".card_pop3").bPopup({
              appendTo: card,
              positionStyle: "absolute",
              position: ["50%", "38px"],
              modal: false,
              follow: [false, false],
              focus: false,
            });
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
        var wrong = xhr.status === 403 || payload.code === "WRONG_PASSWORD";
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

  $(document).on("input", ".card_pop .real_pswd", function () {
    $(this).val(sanitizeSixCharPrintableAscii($(this).val()));
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

  $(document).on("click", ".alert_delete_confirm .b-close", function () {
    var p = $(document).data("pendingDelete");
    if (p && p.$input && p.$input.length) {
      p.$input.val("");
    }
    $(document).removeData("pendingDelete");
  });

  // card_pop3 카드 비밀번호 맞을 시
  $(document).on("click", ".card_pop3 .btn_close", function () {
    var card = $(this).closest(".card");
    msnry.remove(card[0]);
    msnry.layout();
    console.log("Card removed");
  });

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
      setTimeout(
        function () {
          $(el).addClass("is-visible");
          msnry.layout();
        },
        Math.min(idx * 45, 400),
      );
    });
  }

  function bindImageLayout($scope) {
    const $imgs = $scope.find("img");
    if (!$imgs.length) {
      return;
    }
    $imgs.on("load error", function () {
      msnry.layout();
    });
    // 캐시된 이미지(이미 complete)도 초기 배치를 다시 계산
    $imgs.each(function () {
      if (this.complete) {
        msnry.layout();
      }
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
        bindImageLayout($items);
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

  const $initialCards = $(".card_ul .entry-card");
  bindImageLayout($initialCards);
  animateCards($initialCards);
  // 첫 진입 시점(폰트/이미지 반영 뒤) 한번 더 배치 안정화
  setTimeout(function () {
    msnry.layout();
  }, 80);

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
  });

  $("#input_photo").change(function () {
    var filename = this.files[0]?.name;
    if (filename) {
      $(".input_box .photo").text(filename);
    } else {
      $(".input_box .photo").text("");
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

  function openEntryForm() {
    $(".pop").bPopup();
  }

  // $(".floating_wrap .writing, .header_box .btn").on("click", function (e) {
  //   e.preventDefault();
  //   openEntryForm();
  // });

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

  $(".floating_wrap .page_up").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });

  $(".select_box .select_btn").click(function () {
    $(".select_ul").toggleClass("on");
  });

  $(".select_ul li button").click(function () {
    let itemVal = $(this).val();
    let itemText = $(this).text();

    $(".select_box .select_btn").text(itemText);
    $("#input_category_idx").val(itemVal);
    $(".select_ul").removeClass("on");
  });

  $(".btn_more").on("click", function () {
    requestEntries({
      reset: false,
      categoryIdx: Number($categoryInput.val() || 0),
      search: getSearchQuery(),
    });
  });

// 스크롤 시 nav 숨김
let lastScroll = 0;
let isHidden = false;

$(window).on("scroll", function () {
  let currentScroll = $(this).scrollTop();
  let wrapTop = $(".wrap").offset().top - 50;

  // wrap 진입 시 한 번만 hide
  if (!isHidden && currentScroll >= wrapTop) {
    $(".header .hamburger, .header .logo").addClass("hide");
    isHidden = true;
  }

  // wrap 위로 완전히 벗어나면 다시 노출
  if (isHidden && currentScroll < wrapTop - 100) {
    $(".header .hamburger, .header .logo").removeClass("hide");
    isHidden = false;
  }

  lastScroll = currentScroll;
});



  $(".pop .pop_inner form").on("submit", function (e) {
    e.preventDefault();

    const $form = $(this);
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
        $form[0].reset();
        $("#input_phone").val("");
        $(".pop .pop_inner .radio_wrap .radio_box label").removeClass("on");
        const firstCategoryText = $(".select_ul li button").first().text();
        if (firstCategoryText) {
          $(".select_box .select_btn").text(firstCategoryText);
        }
        $(".input_box .photo").text(
          "drag & drop / 이미지 파일 크기 제한 : 10MB(JPG, PNG)",
        );
      },
      error: function (xhr) {
        const response = xhr.responseJSON || {};
        const code = response.code || "";
        const errors = response.errors || {};

        if (code === "DUPLICATE") {
          $(".alert5").bPopup();
          return;
        }

        if (code === "PHOTO_ERROR" || errors.photo) {
          $(".alert4").bPopup();
          return;
        }

        if (errors.consent && errors.award_use_consent) {
          if ($(".alert2_both").length) {
            $(".alert2_both").bPopup();
          } else {
            $(".alert2").bPopup();
          }
          return;
        }

        if (errors.consent) {
          $(".alert2").bPopup();
          return;
        }

        if (errors.award_use_consent) {
          $(".alert2_award").bPopup();
          return;
        }

        $(".alert1").bPopup();
      },
      complete: function () {
        $submitBtn.prop("disabled", false);
      },
    });
  });
});
