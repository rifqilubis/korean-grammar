/* ===============================================================
   KG Korean Grammar - bank data.
   File ini dihasilkan otomatis oleh tools/build-data.js.
   Jangan diubah manual; sunting tools/data-final.js lalu build ulang.
   Struktur topik:
     id, no, title, titleId, level, icon, intro
     blocks : heading | text | formula | rules | examples | note
     quiz   : { q, options[4], answer, why }
     lat    : latihan singkat { ko, rom, id }
   =============================================================== */
window.KG_TOPICS = [
  {
    "id": "hangeul",
    "no": 1,
    "title": "\uD55C\uAE00 \u2014 Huruf Korea",
    "titleId": "Hangeul: dasar membaca",
    "level": 1,
    "icon": "\uD55C",
    "intro": "Huruf Korea dibaca per suku kata: konsonan awal + vokal + konsonan akhir (\uBC1B\uCE68).",
    "blocks": [
      {
        "type": "heading",
        "text": "Konsonan dasar (\uC790\uC74C)"
      },
      {
        "type": "text",
        "text": "Ada 14 konsonan dasar. Bentuk yang lebih tegas berarti bunyinya dihembuskan (aspirasi); bentuk rangkap berarti tegang. Tiga keluarga terpenting: \u3131/\u314B/\u3132, \u3137/\u314C/\u3138, \u3142/\u314D/\u3143."
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "\u3131 g",
            "b": "\u314B k (dihembuskan)",
            "c": "\u3132 kk (tegang)"
          },
          {
            "a": "\u3137 d",
            "b": "\u314C t (dihembuskan)",
            "c": "\u3138 tt (tegang)"
          },
          {
            "a": "\u3142 b",
            "b": "\u314D p (dihembuskan)",
            "c": "\u3143 pp (tegang)"
          },
          {
            "a": "\u3145 s",
            "b": "\u3146 ss (tegang)",
            "c": "\u3148 j, \u3149 jj, \u314A ch"
          },
          {
            "a": "\u3141 m",
            "b": "\u3134 n",
            "c": "\u3139 r/l, \u314E h"
          },
          {
            "a": "\u3147 (awal)",
            "b": "tidak berbunyi",
            "c": "hanya tempat vokal"
          }
        ]
      },
      {
        "type": "heading",
        "text": "Vokal dasar (\uBAA8\uC74C)"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "\u314F a",
            "b": "\u3151 ya",
            "c": "\u3153 eo (mirip \u201Co\u201D ringan)"
          },
          {
            "a": "\u3155 yeo",
            "b": "\u3157 o",
            "c": "\u315B yo"
          },
          {
            "a": "\u315C u",
            "b": "\u3160 yu",
            "c": "\u3161 eu (mulut melebar)"
          },
          {
            "a": "\u3163 i",
            "b": "\u3150 / \u3154 e",
            "c": "\u315A oe, \u315F wi"
          }
        ]
      },
      {
        "type": "heading",
        "text": "Cara merangkai suku kata"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "\u3147 + vokal",
            "b": "dibaca vokalnya saja",
            "c": "\uC544 = a, \uC624 = o"
          },
          {
            "a": "vokal tegak (\u314F \u3153 \u3163)",
            "b": "ditulis di samping",
            "c": "\uAC00, \uB108, \uBBF8"
          },
          {
            "a": "vokal tidur (\u3157 \u315C \u3161)",
            "b": "ditulis di bawah",
            "c": "\uACE0, \uB204, \uD06C"
          },
          {
            "a": "\uBC1B\uCE68 (konsonan akhir)",
            "b": "dibaca pendek",
            "c": "\uC548 = an, \uC9D1 = jip"
          }
        ]
      },
      {
        "type": "heading",
        "text": "Bacaan \uBC1B\uCE68"
      },
      {
        "type": "text",
        "text": "Walau ditulis \u3131 \u314B \u3132, di akhir suku kata semuanya berbunyi [k] yang tidak diletupkan. Hanya tujuh bunyi akhir yang dipakai: \u3131, \u3134, \u3137, \u3139, \u3141, \u3142, \u3147."
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uC9D1",
            "rom": "jip",
            "id": "rumah",
            "why": "\u3148 + \u3163 + \u3142 \u2192 jip"
          },
          {
            "ko": "\uD55C\uAD6D",
            "rom": "hanguk",
            "id": "Korea",
            "why": "\uD55C (han) + \uAD6D (guk)"
          },
          {
            "ko": "\uC0AC\uACFC",
            "rom": "sagwa",
            "id": "apel",
            "why": "sa + gwa (vokal \u3158 = wa)"
          },
          {
            "ko": "\uAE40\uCE58",
            "rom": "gimchi",
            "id": "kimchi",
            "why": "gim + chi"
          },
          {
            "ko": "\uD559\uC0DD",
            "rom": "haksaeng",
            "id": "murid",
            "why": "hak + saeng"
          },
          {
            "ko": "\uBB3C",
            "rom": "mul",
            "id": "air",
            "why": "\u3141 + \u315C + \u3139 \u2192 mul"
          }
        ]
      },
      {
        "type": "note",
        "text": "Tip membaca: pecah kata menjadi suku kata dulu. \uBC14\uB098\uB098 \u2192 \uBC14 \u00B7 \uB098 \u00B7 \uB098 (ba-na-na). Lama-lama mata terbiasa membaca utuh."
      }
    ],
    "quiz": [
      {
        "q": "Huruf mana yang berbunyi [n]?",
        "options": [
          "\u3134",
          "\u3139",
          "\u3141",
          "\u3147"
        ],
        "answer": 0,
        "why": "\u3134 = n. \u3139 = r/l, \u3141 = m, dan \u3147 di awal suku kata tidak berbunyi."
      },
      {
        "q": "\uC9D1 (rumah) dibaca\u2026",
        "options": [
          "jim",
          "jip",
          "jin",
          "ji"
        ],
        "answer": 1,
        "why": "\u3148 = j, \u3163 = i, dan \u3142 sebagai \uBC1B\uCE68 dibaca [p]. Jadi jip."
      },
      {
        "q": "Vokal mana yang dibaca eu dengan mulut melebar?",
        "options": [
          "\u315C",
          "\u3160",
          "\u3161",
          "\u3153"
        ],
        "answer": 2,
        "why": "\u3161 = eu. \u315C = u, \u3160 = yu, \u3153 = eo (mirip o ringan)."
      },
      {
        "q": "Pada suku kata \uC544, huruf \u3147 berfungsi sebagai\u2026",
        "options": [
          "bunyi ng",
          "bunyi n",
          "penanda bunyi panjang",
          "tempat vokal, tidak dibunyikan"
        ],
        "answer": 3,
        "why": "\u3147 di awal suku kata hanya menjadi tempat vokal. Bunyi ng muncul bila \u3147 menjadi \uBC1B\uCE68, misalnya \uAC15 (gang)."
      },
      {
        "q": "\uD55C\uAD6D dibaca\u2026",
        "options": [
          "hanguk",
          "hangu",
          "hankuk-ku",
          "hankok"
        ],
        "answer": 0,
        "why": "\uD55C = han, \uAD6D = guk. Kata utuhnya dibaca hanguk."
      },
      {
        "q": "Konsonan mana yang paling tegang atau kuat?",
        "options": [
          "\u3131",
          "\u3132",
          "\u314B",
          "\u3134"
        ],
        "answer": 1,
        "why": "\u3132 adalah \u3131 yang digandakan (tegang, kk). \u314B adalah versi dihembuskan (k), sedangkan \u3131 ringan (g)."
      },
      {
        "q": "Kata \uC0AC\uACFC (apel) terdiri dari suku kata\u2026",
        "options": [
          "sa-goa",
          "sag-wa",
          "sa-gwa",
          "sa-ka"
        ],
        "answer": 2,
        "why": "\uC0AC = sa, \uACFC = gwa. Vokal \u3157 + \u314F menyatu menjadi \u3158 = wa."
      },
      {
        "q": "Vokal tidur seperti \u3157, \u315C, \u3161 ditulis\u2026",
        "options": [
          "di samping kanan",
          "di atas konsonan",
          "di depan konsonan",
          "di bawah konsonan"
        ],
        "answer": 3,
        "why": "Vokal tidur ditulis di bawah (\uACE0, \uB204, \uD06C), sedangkan vokal tegak di samping (\uAC00, \uB108, \uBBF8)."
      },
      {
        "q": "Berapa bunyi \uBC1B\uCE68 akhir yang dipakai dalam bahasa Korea?",
        "options": [
          "7",
          "5",
          "14",
          "24"
        ],
        "answer": 0,
        "why": "Tujuh bunyi akhir: \u3131, \u3134, \u3137, \u3139, \u3141, \u3142, \u3147. Huruf lain dilarutkan ke salah satunya."
      },
      {
        "q": "\uD559\uC0DD (murid) dibaca\u2026",
        "options": [
          "hagseng",
          "haksaeng",
          "hakseng",
          "haksaem"
        ],
        "answer": 1,
        "why": "\uD559 = hak, \uC0DD = saeng. Vokal \u3150 dibaca e yang terbuka."
      }
    ],
    "lat": [
      {
        "ko": "\uC9D1",
        "rom": "jip",
        "id": "rumah"
      },
      {
        "ko": "\uD55C\uAD6D",
        "rom": "hanguk",
        "id": "Korea"
      },
      {
        "ko": "\uC0AC\uACFC",
        "rom": "sagwa",
        "id": "apel"
      },
      {
        "ko": "\uBB3C",
        "rom": "mul",
        "id": "air"
      }
    ]
  },
  {
    "id": "urutan",
    "no": 2,
    "title": "\uC5B4\uC21C \u2014 Urutan kalimat",
    "titleId": "Pola kalimat S-O-V",
    "level": 1,
    "icon": "\uC21C",
    "intro": "Bahasa Korea menaruh kata kerja di akhir: Subjek + Objek + Kata kerja.",
    "blocks": [
      {
        "type": "heading",
        "text": "Rumus"
      },
      {
        "type": "formula",
        "parts": [
          "Subjek \uC740/\uB294",
          "Objek \uC744/\uB97C",
          "Kata kerja / sifat (di akhir)"
        ]
      },
      {
        "type": "text",
        "text": "Bahasa Indonesia memakai S + P + O, sedangkan bahasa Korea memakai S + O + P. Predikat, baik kata kerja maupun kata sifat, selalu menutup kalimat. Karena setiap kata diberi partikel, peran kata sudah jelas tanpa bergantung pada posisi."
      },
      {
        "type": "heading",
        "text": "Contoh"
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uC800\uB294 \uBC25\uC744 \uBA39\uC5B4\uC694.",
            "rom": "jeo-neun bab-eul meogeoyo.",
            "id": "Saya makan nasi.",
            "why": "\uC800 + \uB294 subjek \u00B7 \uBC25 + \uC744 objek \u00B7 \uBA39\uC5B4\uC694 makan"
          },
          {
            "ko": "\uBBFC\uC218 \uC528\uB294 \uD55C\uAD6D\uC5B4\uB97C \uACF5\uBD80\uD574\uC694.",
            "rom": "minsu-ssi-neun hangugeo-reul gongbuhaeyo.",
            "id": "Minsu belajar bahasa Korea.",
            "why": "\uD55C\uAD6D\uC5B4 + \uB97C objek \u00B7 \uACF5\uBD80\uD574\uC694 belajar"
          },
          {
            "ko": "\uC800\uB294 \uCEE4\uD53C\uB97C \uB9C8\uC154\uC694.",
            "rom": "jeo-neun keopi-reul masyeoyo.",
            "id": "Saya minum kopi.",
            "why": "\uB9C8\uC2DC\uB2E4 \u2192 \uB9C8\uC154\uC694"
          },
          {
            "ko": "\uB3D9\uC0DD\uC774 \uC601\uD654\uB97C \uBD10\uC694.",
            "rom": "dongsaeng-i yeonghwa-reul bwayo.",
            "id": "Adik menonton film.",
            "why": "\uB3D9\uC0DD + \uC774 subjek \u00B7 \uC601\uD654 + \uB97C objek"
          },
          {
            "ko": "\uC5B4\uBA38\uB2C8\uAC00 \uAE40\uCE58\uB97C \uB9CC\uB4E4\uC5B4\uC694.",
            "rom": "eomeoni-ga gimchi-reul mandeureoyo.",
            "id": "Ibu membuat kimchi.",
            "why": "\uB9CC\uB4E4\uB2E4 \u2192 \uB9CC\uB4E4\uC5B4\uC694"
          }
        ]
      },
      {
        "type": "heading",
        "text": "Kata sifat juga di akhir"
      },
      {
        "type": "text",
        "text": "Kata sifat Korea (\uD615\uC6A9\uC0AC) berperilaku seperti kata kerja: menjadi predikat dan diletakkan paling belakang."
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uB0A0\uC528\uAC00 \uC88B\uC544\uC694.",
            "rom": "nalssi-ga joayo.",
            "id": "Cuacanya bagus.",
            "why": "\uB0A0\uC528 + \uAC00 subjek \u00B7 \uC88B\uC544\uC694 bagus"
          },
          {
            "ko": "\uC774 \uC601\uD654\uB294 \uC7AC\uBBF8\uC788\uC5B4\uC694.",
            "rom": "i yeonghwa-neun jaemiisseoyo.",
            "id": "Film ini menarik.",
            "why": "\uC7AC\uBBF8\uC788\uB2E4 \u2192 \uC7AC\uBBF8\uC788\uC5B4\uC694"
          },
          {
            "ko": "\uD55C\uAD6D\uC5B4\uB294 \uC5B4\uB824\uC6CC\uC694.",
            "rom": "hangugeo-neun eoryeowoyo.",
            "id": "Bahasa Korea sulit.",
            "why": "\uC5B4\uB835\uB2E4 \u2192 \uC5B4\uB824\uC6CC\uC694"
          }
        ]
      },
      {
        "type": "note",
        "text": "Kunci praktis: cari kata kerja. Kata itu hampir selalu di akhir, dan subjek biasanya ada di awal."
      }
    ],
    "quiz": [
      {
        "q": "Urutan yang benar untuk \u201CSaya makan apel\u201D adalah\u2026",
        "options": [
          "\uC800\uB294 \uBA39\uC5B4\uC694 \uC0AC\uACFC\uB97C.",
          "\uBA39\uC5B4\uC694 \uC800\uB294 \uC0AC\uACFC\uB97C.",
          "\uC800\uB294 \uC0AC\uACFC\uB97C \uBA39\uC5B4\uC694.",
          "\uC0AC\uACFC\uB97C \uBA39\uC5B4\uC694 \uC800\uB294"
        ],
        "answer": 2,
        "why": "Pola S-O-V: \uC800\uB294 (saya) + \uC0AC\uACFC\uB97C (apel) + \uBA39\uC5B4\uC694 (makan)."
      },
      {
        "q": "Pada kalimat \uC800\uB294 \uD55C\uAD6D\uC5B4\uB97C \uACF5\uBD80\uD574\uC694, kata \uD55C\uAD6D\uC5B4 berperan sebagai\u2026",
        "options": [
          "subjek",
          "predikat",
          "keterangan waktu",
          "objek"
        ],
        "answer": 3,
        "why": "Diikuti partikel \uB97C, penanda objek. Predikatnya adalah \uACF5\uBD80\uD574\uC694."
      },
      {
        "q": "Predikat dalam kalimat Korea biasanya terletak di\u2026",
        "options": [
          "akhir kalimat",
          "awal kalimat",
          "tepat setelah subjek",
          "setelah partikel"
        ],
        "answer": 0,
        "why": "Bahasa Korea berpola S-O-V, sehingga kata kerja atau kata sifat menutup kalimat."
      },
      {
        "q": "Terjemahan \u201CMinsu minum kopi\u201D yang benar adalah\u2026",
        "options": [
          "\uCEE4\uD53C\uB97C \uBBFC\uC218\uB294 \uB9C8\uC154\uC694.",
          "\uBBFC\uC218\uB294 \uCEE4\uD53C\uB97C \uB9C8\uC154\uC694.",
          "\uBBFC\uC218\uB294 \uB9C8\uC154\uC694 \uCEE4\uD53C\uB97C.",
          "\uB9C8\uC154\uC694 \uBBFC\uC218\uB294 \uCEE4\uD53C\uB97C."
        ],
        "answer": 1,
        "why": "Subjek \uBBFC\uC218\uB294 \u2192 objek \uCEE4\uD53C\uB97C \u2192 kata kerja \uB9C8\uC154\uC694. Kata kerja tidak diletakkan di tengah."
      },
      {
        "q": "Kata sifat seperti \uC88B\uC544\uC694 (bagus) diletakkan\u2026",
        "options": [
          "sebelum kata benda",
          "setelah partikel objek",
          "di akhir, seperti kata kerja",
          "di awal kalimat"
        ],
        "answer": 2,
        "why": "Kata sifat Korea menjadi predikat, jadi posisinya di akhir kalimat."
      },
      {
        "q": "Partikel \uB97C menandai\u2026",
        "options": [
          "subjek",
          "tempat",
          "waktu",
          "objek"
        ],
        "answer": 3,
        "why": "\uC744/\uB97C menempel pada kata benda yang menjadi objek kata kerja."
      },
      {
        "q": "Kalimat \u201C\uB3D9\uC0DD\uC774 \uC601\uD654\uB97C \uBD10\uC694\u201D berarti\u2026",
        "options": [
          "Adik menonton film.",
          "Filmnya tentang adik.",
          "Saya menonton film adik.",
          "Adik suka film."
        ],
        "answer": 0,
        "why": "\uB3D9\uC0DD (adik) + \uC774 subjek, \uC601\uD654\uB97C (film) objek, \uBD10\uC694 (menonton)."
      },
      {
        "q": "Mengapa urutan subjek dan objek bisa ditukar dalam bahasa Korea?",
        "options": [
          "karena kata kerja di awal",
          "karena perannya ditandai partikel",
          "karena tidak ada partikel",
          "karena selalu subjek di tengah"
        ],
        "answer": 1,
        "why": "Partikel \uC740/\uB294, \uC774/\uAC00, \uC744/\uB97C menandai peran kata, jadi posisi tidak menentukan arti."
      }
    ],
    "lat": [
      {
        "ko": "\uC800\uB294 \uBC25\uC744 \uBA39\uC5B4\uC694.",
        "rom": "jeo-neun bab-eul meogeoyo.",
        "id": "Saya makan nasi."
      },
      {
        "ko": "\uC800\uB294 \uCEE4\uD53C\uB97C \uB9C8\uC154\uC694.",
        "rom": "jeo-neun keopi-reul masyeoyo.",
        "id": "Saya minum kopi."
      },
      {
        "ko": "\uB0A0\uC528\uAC00 \uC88B\uC544\uC694.",
        "rom": "nalssi-ga joayo.",
        "id": "Cuacanya bagus."
      }
    ]
  },
  {
    "id": "eun-neun",
    "no": 3,
    "title": "\uC740/\uB294 \u2014 Topik kalimat",
    "titleId": "Partikel topik \uC740/\uB294",
    "level": 1,
    "icon": "\uC740",
    "intro": "\uC740/\uB294 menandai topik pembicaraan, atau memberi rasa perbandingan.",
    "blocks": [
      {
        "type": "heading",
        "text": "Rumus pemakaian"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "berakhiran konsonan",
            "b": "\u2192 \uC740",
            "c": "\uD559\uC0DD \u2192 \uD559\uC0DD\uC740, \uBC25 \u2192 \uBC25\uC740"
          },
          {
            "a": "berakhiran vokal",
            "b": "\u2192 \uB294",
            "c": "\uC800 \u2192 \uC800\uB294, \uB098\uBB34 \u2192 \uB098\uBB34\uB294"
          }
        ]
      },
      {
        "type": "heading",
        "text": "Tiga fungsi utama"
      },
      {
        "type": "text",
        "text": "Pertama, menandai topik kalimat. Kedua, membandingkan: \u201Ckalau A\u2026, kalau B\u2026\u201D. Ketiga, membicarakan hal umum yang sudah diketahui lawan bicara."
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uC800\uB294 \uD559\uC0DD\uC774\uC5D0\uC694.",
            "rom": "jeo-neun haksaeng-ieyo.",
            "id": "Saya murid.",
            "why": "\uC800 berakhiran vokal \u2192 \uB294"
          },
          {
            "ko": "\uBB3C\uC740 \uC788\uC5B4\uC694.",
            "rom": "mul-eun isseoyo.",
            "id": "Airnya ada.",
            "why": "\uBB3C berakhiran \u3139 \u2192 \uC740"
          },
          {
            "ko": "\uC5B4\uBA38\uB2C8\uB294 \uC694\uB9AC\uD574\uC694.",
            "rom": "eomeoni-neun yorihaeyo.",
            "id": "Ibu memasak.",
            "why": "\uC5B4\uBA38\uB2C8 berakhiran vokal \u2192 \uB294"
          },
          {
            "ko": "\uC800\uB294 \uCEE4\uD53C\uB294 \uB9C8\uC154\uC694.",
            "rom": "jeo-neun keopi-neun masyeoyo.",
            "id": "Kalau kopi, saya minum.",
            "why": "\uB294 kedua memberi rasa perbandingan"
          },
          {
            "ko": "\uD55C\uAD6D \uB0A0\uC528\uB294 \uC5B4\uB54C\uC694?",
            "rom": "hanguk nalssi-neun eottaeyo?",
            "id": "Bagaimana cuaca di Korea?",
            "why": "topik: cuaca Korea"
          }
        ]
      },
      {
        "type": "heading",
        "text": "\uC740/\uB294 dibandingkan \uC774/\uAC00"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "\uC740/\uB294",
            "b": "topik, perbandingan",
            "c": "\uC800\uB294 \uC758\uC0AC\uC608\uC694 = Saya dokter."
          },
          {
            "a": "\uC774/\uAC00",
            "b": "pelaku, informasi baru",
            "c": "\uC81C\uAC00 \uD560\uAC8C\uC694 = Saya yang akan melakukan."
          },
          {
            "a": "jangan",
            "b": "\uC740/\uB294 dua kali pada subjek",
            "c": "cukup sekali di awal kalimat"
          }
        ]
      },
      {
        "type": "note",
        "text": "Aturan aman untuk pemula: topik kalimat di awal memakai \uC740/\uB294, objek memakai \uC744/\uB97C, dan bagian yang baru disebut memakai \uC774/\uAC00."
      }
    ],
    "quiz": [
      {
        "q": "Lengkapi: \uC800___ \uC120\uC0DD\uB2D8\uC774\uC5D0\uC694.",
        "options": [
          "\uC740",
          "\uC774",
          "\uB294",
          "\uB97C"
        ],
        "answer": 2,
        "why": "\uC800 berakhiran vokal, jadi memakai \uB294. Bentuk \uC740 untuk kata berakhiran konsonan."
      },
      {
        "q": "Lengkapi: \uCEE4\uD53C___ \uB9DB\uC788\uC5B4\uC694. (Kopinya enak.)",
        "options": [
          "\uC774",
          "\uB294",
          "\uB97C",
          "\uAC00"
        ],
        "answer": 3,
        "why": "\uCEE4\uD53C berakhiran vokal, jadi memakai \uAC00. \uCEE4\uD53C + \uAC00 = \uCEE4\uD53C\uAC00 \uB9DB\uC788\uC5B4\uC694."
      },
      {
        "q": "Partikel \uC740 dipakai setelah kata yang berakhiran\u2026",
        "options": [
          "konsonan",
          "vokal",
          "angka Cina",
          "tanda baca"
        ],
        "answer": 0,
        "why": "\uC740 dipakai setelah \uBC1B\uCE68 atau konsonan akhir, sedangkan \uB294 setelah vokal."
      },
      {
        "q": "\uC800\uB294 \uC758\uC0AC\uC608\uC694 berarti\u2026",
        "options": [
          "Dokter saya.",
          "Saya dokter.",
          "Saya bukan dokter.",
          "Dokter untuk saya."
        ],
        "answer": 1,
        "why": "\uC758\uC0AC = dokter, \uC774\uC5D0\uC694/\uC608\uC694 = adalah. \uC800\uB294 menandai saya sebagai topik."
      },
      {
        "q": "Kata mana yang memakai \uB294?",
        "options": [
          "\uCC45",
          "\uD559\uC0DD",
          "\uB098",
          "\uBB3C"
        ],
        "answer": 2,
        "why": "\uB098 berakhiran vokal \u2192 \uB098\uB294. \uCC45, \uD559\uC0DD, \uBB3C berakhiran konsonan \u2192 \uC740."
      },
      {
        "q": "Fungsi utama \uC740/\uB294 adalah\u2026",
        "options": [
          "menandai objek",
          "menandai tempat",
          "menandai kata kerja",
          "menandai topik kalimat"
        ],
        "answer": 3,
        "why": "\uC740/\uB294 disebut partikel topik. Partikel objek adalah \uC744/\uB97C."
      },
      {
        "q": "Lengkapi: \uC5B4\uBA38\uB2C8___ \uC694\uB9AC\uD574\uC694.",
        "options": [
          "\uB294",
          "\uC740",
          "\uB97C",
          "\uC5D0"
        ],
        "answer": 0,
        "why": "\uC5B4\uBA38\uB2C8 berakhiran vokal \u3163, jadi memakai \uB294."
      },
      {
        "q": "Kalimat \uC800\uB294 \uCEE4\uD53C\uB294 \uB9C8\uC154\uC694 paling tepat diartikan\u2026",
        "options": [
          "Saya tidak minum kopi.",
          "Kalau kopi, saya minum.",
          "Saya suka kopi.",
          "Kopi itu diminum."
        ],
        "answer": 1,
        "why": "\uB294 pada \uCEE4\uD53C memberi rasa perbandingan: kopi diminum, mungkin minuman lain tidak."
      }
    ],
    "lat": [
      {
        "ko": "\uC800\uB294 \uD559\uC0DD\uC774\uC5D0\uC694.",
        "rom": "jeo-neun haksaeng-ieyo.",
        "id": "Saya murid."
      },
      {
        "ko": "\uBB3C\uC740 \uC788\uC5B4\uC694.",
        "rom": "mul-eun isseoyo.",
        "id": "Airnya ada."
      },
      {
        "ko": "\uC5B4\uBA38\uB2C8\uB294 \uC694\uB9AC\uD574\uC694.",
        "rom": "eomeoni-neun yorihaeyo.",
        "id": "Ibu memasak."
      }
    ]
  },
  {
    "id": "i-ga",
    "no": 4,
    "title": "\uC774/\uAC00 \u2014 Subjek pelaku",
    "titleId": "Partikel subjek \uC774/\uAC00",
    "level": 1,
    "icon": "\uAC00",
    "intro": "\uC774/\uAC00 menandai subjek pelaku dan menjawab pertanyaan \u201Csiapa?\u201D atau \u201Capa?\u201D.",
    "blocks": [
      {
        "type": "heading",
        "text": "Rumus pemakaian"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "berakhiran konsonan",
            "b": "\u2192 \uC774",
            "c": "\uCC45 \u2192 \uCC45\uC774, \uBE44 \u2192 \uBE44\uAC00"
          },
          {
            "a": "berakhiran vokal",
            "b": "\u2192 \uAC00",
            "c": "\uCE5C\uAD6C \u2192 \uCE5C\uAD6C\uAC00, \uCEE4\uD53C \u2192 \uCEE4\uD53C\uAC00"
          }
        ]
      },
      {
        "type": "heading",
        "text": "Kapan dipakai"
      },
      {
        "type": "text",
        "text": "Pertama, menjawab pertanyaan \uB204\uAC00? (siapa) atau \uBB34\uC5C7\uC774? (apa). Kedua, memperkenalkan informasi baru. Ketiga, kata kerja tertentu selalu butuh \uC774/\uAC00 seperti \uC788\uB2E4, \uC5C6\uB2E4, \uC544\uD504\uB2E4, \uB418\uB2E4, dan \uB9C8\uC74C\uC5D0 \uB4E4\uB2E4."
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uB204\uAC00 \uC654\uC5B4\uC694? \uBBFC\uC218\uAC00 \uC654\uC5B4\uC694.",
            "rom": "nuga wasseoyo? minsu-ga wasseoyo.",
            "id": "Siapa yang datang? Minsu yang datang.",
            "why": "jawaban siapa memakai \uAC00"
          },
          {
            "ko": "\uBE44\uAC00 \uC640\uC694.",
            "rom": "bi-ga wayo.",
            "id": "Hujan turun.",
            "why": "\uBE44 + \uAC00 sebagai subjek"
          },
          {
            "ko": "\uCE5C\uAD6C\uAC00 \uB9CE\uC544\uC694.",
            "rom": "chingu-ga manayo.",
            "id": "Temannya banyak.",
            "why": "menyatakan jumlah atau keberadaan"
          },
          {
            "ko": "\uC800\uB294 \uBA38\uB9AC\uAC00 \uC544\uD30C\uC694.",
            "rom": "jeo-neun meori-ga apayo.",
            "id": "Saya sakit kepala.",
            "why": "topik saya, bagian tubuh \uBA38\uB9AC + \uAC00"
          },
          {
            "ko": "\uCEE4\uD53C\uAC00 \uC2DD\uC5C8\uC5B4\uC694.",
            "rom": "keopi-ga sigeosseoyo.",
            "id": "Kopinya sudah dingin.",
            "why": "\uC2DD\uB2E4 (menjadi dingin) memakai \uC774/\uAC00"
          }
        ]
      },
      {
        "type": "heading",
        "text": "Bentuk khusus"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "\uC800 + \uAC00",
            "b": "\uC81C\uAC00",
            "c": "bukan \uC800\uAC00"
          },
          {
            "a": "\uB098 + \uAC00",
            "b": "\uB0B4\uAC00",
            "c": "bukan \uB098\uAC00"
          },
          {
            "a": "\uB204\uAD6C + \uAC00",
            "b": "\uB204\uAC00",
            "c": "bukan \uB204\uAD6C\uAC00"
          }
        ]
      },
      {
        "type": "note",
        "text": "Bandingkan: \uC800\uB294 \uC0AC\uACFC\uB97C \uC88B\uC544\uD574\uC694 (saya suka apel) dan \uC0AC\uACFC\uAC00 \uC88B\uC544\uC694 (apelnya bagus). Kata kerja menyukai memakai objek \uC744/\uB97C, sedangkan kata sifat memakai subjek \uC774/\uAC00."
      }
    ],
    "quiz": [
      {
        "q": "Lengkapi: \uCEE4\uD53C___ \uB9DB\uC788\uC5B4\uC694.",
        "options": [
          "\uC774",
          "\uB294",
          "\uAC00",
          "\uB97C"
        ],
        "answer": 2,
        "why": "\uCEE4\uD53C berakhiran vokal, jadi memakai \uAC00. Bentuk \uC774 untuk kata berakhiran konsonan."
      },
      {
        "q": "Lengkapi: \uCC45___ \uC5EC\uAE30 \uC788\uC5B4\uC694.",
        "options": [
          "\uAC00",
          "\uC740",
          "\uC744",
          "\uC774"
        ],
        "answer": 3,
        "why": "\uCC45 berakhiran konsonan \u3131, jadi memakai \uC774."
      },
      {
        "q": "Jawaban \uC81C\uAC00 \uD588\uC5B4\uC694 paling tepat untuk menjawab\u2026",
        "options": [
          "\uB204\uAC00 \uD588\uC5B4\uC694?",
          "\uBB50 \uD588\uC5B4\uC694?",
          "\uC5B4\uB514 \uC788\uC5B4\uC694?",
          "\uC5B8\uC81C \uD588\uC5B4\uC694?"
        ],
        "answer": 0,
        "why": "\uB204\uAC00 menanyakan siapa pelakunya, jadi jawabannya memakai \uC774/\uAC00: \uC81C\uAC00."
      },
      {
        "q": "Kata kerja yang selalu butuh \uC774/\uAC00 adalah\u2026",
        "options": [
          "\uBA39\uB2E4",
          "\uC788\uB2E4 dan \uC5C6\uB2E4",
          "\uB9C8\uC2DC\uB2E4",
          "\uBCF4\uB2E4"
        ],
        "answer": 1,
        "why": "\uC788\uB2E4 dan \uC5C6\uB2E4 menyatakan keberadaan, jadi bendanya memakai \uC774/\uAC00: \uC2DC\uAC04\uC774 \uC788\uC5B4\uC694."
      },
      {
        "q": "Manakah yang salah secara tata bahasa?",
        "options": [
          "\uC81C\uAC00 \uD559\uC0DD\uC774\uC5D0\uC694.",
          "\uC81C\uAC00 \uD560\uAC8C\uC694.",
          "\uC800\uAC00 \uD559\uC0DD\uC774\uC5D0\uC694.",
          "\uB204\uAC00 \uC654\uC5B4\uC694?"
        ],
        "answer": 2,
        "why": "\uC800 + \uAC00 berubah menjadi \uC81C\uAC00. Bentuk \uC81C adalah bentuk berpartikel dari \uC800."
      },
      {
        "q": "\uBE44\uAC00 \uC640\uC694 berarti\u2026",
        "options": [
          "Hujan sudah berhenti.",
          "Saya kehujanan.",
          "Cuaca akan hujan.",
          "Hujan turun."
        ],
        "answer": 3,
        "why": "\uBE44 (hujan) + \uAC00 subjek, \uC640\uC694 (datang/turun). Artinya hujan turun."
      },
      {
        "q": "Lengkapi: \uC2DC\uAC04___ \uC788\uC5B4\uC694?",
        "options": [
          "\uC774",
          "\uAC00",
          "\uC740",
          "\uC744"
        ],
        "answer": 0,
        "why": "\uC2DC\uAC04 berakhiran konsonan \u3134, jadi memakai \uC774."
      },
      {
        "q": "Kalimat \uC0AC\uACFC\uAC00 \uC88B\uC544\uC694 berarti\u2026",
        "options": [
          "Saya suka apel.",
          "Apelnya bagus.",
          "Apel itu mahal.",
          "Saya beli apel."
        ],
        "answer": 1,
        "why": "Kata sifat dengan subjek \uC774/\uAC00: apel sebagai subjek yang bagus. Untuk menyukai, dipakai \uC0AC\uACFC\uB97C \uC88B\uC544\uD574\uC694."
      }
    ],
    "lat": [
      {
        "ko": "\uBE44\uAC00 \uC640\uC694.",
        "rom": "bi-ga wayo.",
        "id": "Hujan turun."
      },
      {
        "ko": "\uCE5C\uAD6C\uAC00 \uB9CE\uC544\uC694.",
        "rom": "chingu-ga manayo.",
        "id": "Temannya banyak."
      },
      {
        "ko": "\uC800\uB294 \uBA38\uB9AC\uAC00 \uC544\uD30C\uC694.",
        "rom": "jeo-neun meori-ga apayo.",
        "id": "Saya sakit kepala."
      }
    ]
  },
  {
    "id": "eul-reul",
    "no": 5,
    "title": "\uC744/\uB97C \u2014 Objek",
    "titleId": "Partikel objek \uC744/\uB97C",
    "level": 2,
    "icon": "\uC744",
    "intro": "\uC744/\uB97C menempel pada benda yang dikenai tindakan kata kerja.",
    "blocks": [
      {
        "type": "heading",
        "text": "Rumus pemakaian"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "berakhiran konsonan",
            "b": "\u2192 \uC744",
            "c": "\uBC25 \u2192 \uBC25\uC744, \uCC45 \u2192 \uCC45\uC744"
          },
          {
            "a": "berakhiran vokal",
            "b": "\u2192 \uB97C",
            "c": "\uCEE4\uD53C \u2192 \uCEE4\uD53C\uB97C, \uC601\uD654 \u2192 \uC601\uD654\uB97C"
          }
        ]
      },
      {
        "type": "text",
        "text": "Objek adalah benda yang menerima aksi: yang dimakan, diminum, dibaca, dilihat, dipelajari, atau dibeli. Dalam percakapan santai partikel ini sering dihilangkan, tetapi selalu aman ditulis lengkap saat belajar."
      },
      {
        "type": "heading",
        "text": "Contoh"
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uBC25\uC744 \uBA39\uC5B4\uC694.",
            "rom": "bab-eul meogeoyo.",
            "id": "Makan nasi.",
            "why": "\uBC25 berakhiran \u3142 \u2192 \uC744"
          },
          {
            "ko": "\uCEE4\uD53C\uB97C \uB9C8\uC154\uC694.",
            "rom": "keopi-reul masyeoyo.",
            "id": "Minum kopi.",
            "why": "\uCEE4\uD53C berakhiran vokal \u2192 \uB97C"
          },
          {
            "ko": "\uD55C\uAD6D\uC5B4\uB97C \uBC30\uC6CC\uC694.",
            "rom": "hangugeo-reul baewoyo.",
            "id": "Belajar bahasa Korea.",
            "why": "\uBC30\uC6B0\uB2E4 \u2192 \uBC30\uC6CC\uC694"
          },
          {
            "ko": "\uCC45\uC744 \uC77D\uC5B4\uC694.",
            "rom": "chaeg-eul ilgeoyo.",
            "id": "Membaca buku.",
            "why": "\uC77D\uB2E4 \u2192 \uC77D\uC5B4\uC694"
          },
          {
            "ko": "\uC601\uD654\uB97C \uBD10\uC694.",
            "rom": "yeonghwa-reul bwayo.",
            "id": "Menonton film.",
            "why": "\uBCF4\uB2E4 \u2192 \uBD10\uC694"
          },
          {
            "ko": "\uCE5C\uAD6C\uB97C \uB9CC\uB098\uC694.",
            "rom": "chingu-reul mannayo.",
            "id": "Bertemu teman.",
            "why": "\uB9CC\uB098\uB2E4 \u2192 \uB9CC\uB098\uC694"
          }
        ]
      },
      {
        "type": "heading",
        "text": "Objek dalam kalimat panjang"
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uC800\uB294 \uB9E4\uC77C \uD55C\uAD6D\uC5B4\uB97C \uB450 \uC2DC\uAC04 \uACF5\uBD80\uD574\uC694.",
            "rom": "jeo-neun maeil hangugeo-reul du sigan gongbuhaeyo.",
            "id": "Saya belajar bahasa Korea dua jam setiap hari."
          },
          {
            "ko": "\uC5B4\uC81C \uC601\uD654\uB97C \uB450 \uD3B8 \uBD24\uC5B4\uC694.",
            "rom": "eoje yeonghwa-reul du pyeon bwasseoyo.",
            "id": "Kemarin saya menonton dua film."
          }
        ]
      },
      {
        "type": "note",
        "text": "Hati-hati: menyukai memakai objek \uC744/\uB97C, jadi \uC800\uB294 \uCEE4\uD53C\uB97C \uC88B\uC544\uD574\uC694. Sebaliknya, enak atau bagus memakai subjek \uC774/\uAC00, jadi \uCEE4\uD53C\uAC00 \uB9DB\uC788\uC5B4\uC694."
      }
    ],
    "quiz": [
      {
        "q": "Lengkapi: \uCC45___ \uC77D\uC5B4\uC694.",
        "options": [
          "\uB97C",
          "\uC774",
          "\uC744",
          "\uAC00"
        ],
        "answer": 2,
        "why": "\uCC45 berakhiran konsonan \u3131, jadi memakai \uC744."
      },
      {
        "q": "Lengkapi: \uC601\uD654___ \uBD10\uC694.",
        "options": [
          "\uC744",
          "\uAC00",
          "\uB294",
          "\uB97C"
        ],
        "answer": 3,
        "why": "\uC601\uD654 berakhiran vokal, jadi memakai \uB97C."
      },
      {
        "q": "Partikel \uC744/\uB97C menandai\u2026",
        "options": [
          "objek kata kerja",
          "subjek kalimat",
          "tempat kejadian",
          "waktu kejadian"
        ],
        "answer": 0,
        "why": "\uC744/\uB97C adalah partikel objek yang menempel pada benda yang dikenai aksi."
      },
      {
        "q": "Kalimat yang benar adalah\u2026",
        "options": [
          "\uC800\uB294 \uCEE4\uD53C\uAC00 \uC88B\uC544\uD574\uC694.",
          "\uC800\uB294 \uCEE4\uD53C\uB97C \uC88B\uC544\uD574\uC694.",
          "\uC800\uB294 \uCEE4\uD53C\uC744 \uC88B\uC544\uD574\uC694.",
          "\uC800\uB294 \uCEE4\uD53C\uB294 \uC88B\uC544\uD574\uC694."
        ],
        "answer": 1,
        "why": "\uC88B\uC544\uD558\uB2E4 (menyukai) membutuhkan objek, jadi \uCEE4\uD53C\uB97C."
      },
      {
        "q": "Lengkapi: \uD55C\uAD6D\uC5B4___ \uBC30\uC6CC\uC694.",
        "options": [
          "\uC744",
          "\uC774",
          "\uB97C",
          "\uC5D0"
        ],
        "answer": 2,
        "why": "\uD55C\uAD6D\uC5B4 berakhiran vokal, jadi memakai \uB97C."
      },
      {
        "q": "Pasangan yang tepat adalah\u2026",
        "options": [
          "\uBC25\uB97C dan \uCEE4\uD53C\uC744",
          "\uBC25\uC774 dan \uCEE4\uD53C\uC744",
          "\uBC25\uC744 dan \uCEE4\uD53C\uC744",
          "\uBC25\uC744 dan \uCEE4\uD53C\uB97C"
        ],
        "answer": 3,
        "why": "\uBC25 berakhiran konsonan \u2192 \uC744, sedangkan \uCEE4\uD53C tanpa konsonan akhir \u2192 \uB97C."
      },
      {
        "q": "\uC800\uB294 \uC0AC\uACFC\uB97C \uBA39\uC5B4\uC694 berpola\u2026",
        "options": [
          "S + O + P",
          "S + P + O",
          "P + S + O",
          "O + S + P"
        ],
        "answer": 0,
        "why": "\uC800\uB294 subjek, \uC0AC\uACFC\uB97C objek, \uBA39\uC5B4\uC694 predikat."
      },
      {
        "q": "Kata kerja mana yang TIDAK lazim mengambil objek \uC744/\uB97C?",
        "options": [
          "\uBA39\uB2E4",
          "\uB9DB\uC788\uB2E4",
          "\uC77D\uB2E4",
          "\uB9C8\uC2DC\uB2E4"
        ],
        "answer": 1,
        "why": "\uB9DB\uC788\uB2E4 adalah kata sifat, jadi memakai subjek \uC774/\uAC00: \uC74C\uC2DD\uC774 \uB9DB\uC788\uC5B4\uC694."
      }
    ],
    "lat": [
      {
        "ko": "\uBC25\uC744 \uBA39\uC5B4\uC694.",
        "rom": "bab-eul meogeoyo.",
        "id": "Makan nasi."
      },
      {
        "ko": "\uCEE4\uD53C\uB97C \uB9C8\uC154\uC694.",
        "rom": "keopi-reul masyeoyo.",
        "id": "Minum kopi."
      },
      {
        "ko": "\uD55C\uAD6D\uC5B4\uB97C \uBC30\uC6CC\uC694.",
        "rom": "hangugeo-reul baewoyo.",
        "id": "Belajar bahasa Korea."
      }
    ]
  },
  {
    "id": "ieyo",
    "no": 6,
    "title": "\uC774\uC5D0\uC694/\uC608\uC694 \u2014 \u201CAdalah\u201D",
    "titleId": "Kopula \uC774\uC5D0\uC694 / \uC608\uC694",
    "level": 2,
    "icon": "\uC694",
    "intro": "Untuk menyebut \u201CA adalah B\u201D: \uC774\uC5D0\uC694 setelah konsonan, \uC608\uC694 setelah vokal.",
    "blocks": [
      {
        "type": "heading",
        "text": "Rumus"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "berakhiran konsonan",
            "b": "+ \uC774\uC5D0\uC694",
            "c": "\uD559\uC0DD \u2192 \uD559\uC0DD\uC774\uC5D0\uC694 (haksaeng-ieyo)"
          },
          {
            "a": "berakhiran vokal",
            "b": "+ \uC608\uC694",
            "c": "\uC758\uC0AC \u2192 \uC758\uC0AC\uC608\uC694 (uisa-yeyo)"
          },
          {
            "a": "-\u3142\uB2C8\uB2E4 bentuk resmi",
            "b": "+ \uC785\uB2C8\uB2E4",
            "c": "\uD559\uC0DD\uC785\uB2C8\uB2E4, \uC758\uC0AC\uC785\uB2C8\uB2E4"
          }
        ]
      },
      {
        "type": "text",
        "text": "\uC774\uC5D0\uC694 dan \uC608\uC694 adalah bentuk sopan informal (\uD574\uC694\uCCB4). Bentuk ini bisa dipakai kepada orang yang baru dikenal, sedangkan \uC785\uB2C8\uB2E4 lebih resmi, misalnya dalam presentasi."
      },
      {
        "type": "heading",
        "text": "Bentuk negatif dan tanya"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "adalah",
            "b": "\uC774\uC5D0\uC694 / \uC608\uC694",
            "c": "\uC800\uB294 \uD559\uC0DD\uC774\uC5D0\uC694."
          },
          {
            "a": "bukan",
            "b": "\uC544\uB2C8\uC5D0\uC694",
            "c": "\uC800\uB294 \uD559\uC0DD\uC774 \uC544\uB2C8\uC5D0\uC694."
          },
          {
            "a": "bertanya",
            "b": "naikkan intonasi",
            "c": "\uD559\uC0DD\uC774\uC5D0\uC694? = Apakah kamu murid?"
          }
        ]
      },
      {
        "type": "heading",
        "text": "Contoh"
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uC800\uB294 \uD559\uC0DD\uC774\uC5D0\uC694.",
            "rom": "jeo-neun haksaeng-ieyo.",
            "id": "Saya murid."
          },
          {
            "ko": "\uC774\uBD84\uC740 \uC81C \uCE5C\uAD6C\uC608\uC694.",
            "rom": "ibun-eun je chingu-yeyo.",
            "id": "Ini teman saya.",
            "why": "\uCE5C\uAD6C berakhiran vokal \u2192 \uC608\uC694"
          },
          {
            "ko": "\uC774\uAC70 \uBB50\uC608\uC694?",
            "rom": "igeo mwoyeyo?",
            "id": "Ini apa?",
            "why": "\uBB50 + \uC608\uC694"
          },
          {
            "ko": "\uC800\uB294 \uC758\uC0AC\uAC00 \uC544\uB2C8\uC5D0\uC694.",
            "rom": "jeo-neun uisa-ga anieyo.",
            "id": "Saya bukan dokter.",
            "why": "negatif memakai \uC544\uB2C8\uC5D0\uC694"
          },
          {
            "ko": "\uC774\uAC83\uC740 \uC81C \uCC45\uC774\uC5D0\uC694.",
            "rom": "igeos-eun je chaeg-ieyo.",
            "id": "Ini buku saya."
          }
        ]
      },
      {
        "type": "note",
        "text": "Ingat: pilihan \uC774\uC5D0\uC694 atau \uC608\uC694 hanya bergantung pada bunyi kata sebelumnya, bukan pada orang atau jenis kelamin."
      }
    ],
    "quiz": [
      {
        "q": "Lengkapi: \uC800\uB294 \uC758\uC0AC___ .",
        "options": [
          "\uC774\uC5D0\uC694",
          "\uC544\uB2C8\uC5D0\uC694",
          "\uC608\uC694",
          "\uC785\uB2C8\uB2E4\uC694"
        ],
        "answer": 2,
        "why": "\uC758\uC0AC berakhiran vokal, jadi memakai \uC608\uC694."
      },
      {
        "q": "Lengkapi: \uD55C\uAD6D \uC0AC\uB78C___?",
        "options": [
          "\uC608\uC694",
          "\uC744",
          "\uC5D0",
          "\uC774\uC5D0\uC694"
        ],
        "answer": 3,
        "why": "\uC0AC\uB78C berakhiran konsonan \u3141, jadi memakai \uC774\uC5D0\uC694."
      },
      {
        "q": "Bentuk yang benar untuk \u201CSaya bukan murid\u201D adalah\u2026",
        "options": [
          "\uC800\uB294 \uD559\uC0DD\uC774 \uC544\uB2C8\uC5D0\uC694.",
          "\uC800\uB294 \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694.",
          "\uC800\uB294 \uD559\uC0DD \uC544\uB2C8\uC608\uC694.",
          "\uC800\uB294 \uD559\uC0DD\uC774\uC5B4\uC694."
        ],
        "answer": 0,
        "why": "Negatif kopula adalah \uC544\uB2C8\uC5D0\uC694. Bentuk \uC5C6\uC5B4\uC694 berarti tidak ada, berbeda makna."
      },
      {
        "q": "Lengkapi: \uC774\uAC70 \uBB50___?",
        "options": [
          "\uC774\uC5D0\uC694",
          "\uC608\uC694",
          "\uD574\uC694",
          "\uC774\uC694"
        ],
        "answer": 1,
        "why": "\uBB50 berakhiran vokal, jadi memakai \uC608\uC694. Dalam pelafalan menyatu menjadi mwoyeyo."
      },
      {
        "q": "Kapan \uC774\uC5D0\uC694 dipakai?",
        "options": [
          "setelah kata berakhiran vokal",
          "hanya untuk benda",
          "setelah kata berakhiran konsonan",
          "hanya dalam kalimat tanya"
        ],
        "answer": 2,
        "why": "\uC774\uC5D0\uC694 dipakai bila kata sebelumnya berakhiran konsonan, misalnya \uCC45\uC774\uC5D0\uC694."
      },
      {
        "q": "\uC774\uCABD\uC740 \uC81C \uC5B4\uBA38\uB2C8\uC608\uC694 berarti\u2026",
        "options": [
          "Ini teman saya.",
          "Saya ibunya.",
          "Ibunya ada di sini.",
          "Ini ibu saya."
        ],
        "answer": 3,
        "why": "\uC774\uCABD\uC740 = ini, \uC81C \uC5B4\uBA38\uB2C8 = ibu saya, \uC608\uC694 = adalah."
      },
      {
        "q": "Bentuk resmi dari \uC774\uC5D0\uC694/\uC608\uC694 adalah\u2026",
        "options": [
          "\uC785\uB2C8\uB2E4",
          "\uC774\uC5D0\uC694?",
          "\uC544\uB2C8\uC5D0\uC694",
          "\uC788\uC5B4\uC694"
        ],
        "answer": 0,
        "why": "\uC785\uB2C8\uB2E4 adalah bentuk formal, misalnya \uC800\uB294 \uD559\uC0DD\uC785\uB2C8\uB2E4."
      }
    ],
    "lat": [
      {
        "ko": "\uC800\uB294 \uD559\uC0DD\uC774\uC5D0\uC694.",
        "rom": "jeo-neun haksaeng-ieyo.",
        "id": "Saya murid."
      },
      {
        "ko": "\uC774\uAC70 \uBB50\uC608\uC694?",
        "rom": "igeo mwoyeyo?",
        "id": "Ini apa?"
      },
      {
        "ko": "\uC800\uB294 \uC758\uC0AC\uAC00 \uC544\uB2C8\uC5D0\uC694.",
        "rom": "jeo-neun uisa-ga anieyo.",
        "id": "Saya bukan dokter."
      }
    ]
  },
  {
    "id": "isseoyo",
    "no": 7,
    "title": "\uC788\uC5B4\uC694/\uC5C6\uC5B4\uC694 \u2014 Ada / Tidak ada",
    "titleId": "\uC788\uB2E4 dan \uC5C6\uB2E4: keberadaan",
    "level": 2,
    "icon": "\uC788",
    "intro": "\uC788\uC5B4\uC694 = ada atau punya, \uC5C6\uC5B4\uC694 = tidak ada atau tidak punya. Bendanya memakai \uC774/\uAC00.",
    "blocks": [
      {
        "type": "heading",
        "text": "Pola dasar"
      },
      {
        "type": "formula",
        "parts": [
          "Benda / orang + \uC774/\uAC00",
          "\uC788\uC5B4\uC694 / \uC5C6\uC5B4\uC694"
        ]
      },
      {
        "type": "text",
        "text": "\uC788\uB2E4 dan \uC5C6\uB2E4 tidak beraturan penuh, tetapi bentuk sopannya sederhana: \uC788\uB2E4 \u2192 \uC788\uC5B4\uC694, \uC5C6\uB2E4 \u2192 \uC5C6\uC5B4\uC694."
      },
      {
        "type": "heading",
        "text": "Dua arti utama"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "ada / tidak ada",
            "b": "\uBB3C\uC774 \uC788\uC5B4\uC694",
            "c": "Ada air. / \uBB3C\uC774 \uC5C6\uC5B4\uC694 = Tidak ada air."
          },
          {
            "a": "punya / tidak punya",
            "b": "\uCC45\uC774 \uC788\uC5B4\uC694",
            "c": "Punya buku. / \uC2DC\uAC04\uC774 \uC5C6\uC5B4\uC694 = Tidak punya waktu."
          }
        ]
      },
      {
        "type": "heading",
        "text": "Contoh"
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uD654\uC7A5\uC2E4\uC774 \uC5B4\uB514\uC5D0 \uC788\uC5B4\uC694?",
            "rom": "hwajangsil-i eodie isseoyo?",
            "id": "Di mana toiletnya?",
            "why": "\uC5B4\uB514\uC5D0 = di mana"
          },
          {
            "ko": "\uC800\uB294 \uB3D9\uC0DD\uC774 \uC788\uC5B4\uC694.",
            "rom": "jeo-neun dongsaeng-i isseoyo.",
            "id": "Saya punya adik.",
            "why": "topik saya, yang ada adalah \uB3D9\uC0DD"
          },
          {
            "ko": "\uC2DC\uAC04\uC774 \uC5C6\uC5B4\uC694.",
            "rom": "sigan-i eopseoyo.",
            "id": "Tidak ada waktu.",
            "why": "\uC5C6\uC5B4\uC694 = tidak ada"
          },
          {
            "ko": "\uC9D1\uC5D0 \uBB3C\uC774 \uC788\uC5B4\uC694?",
            "rom": "jib-e mul-i isseoyo?",
            "id": "Apa ada air di rumah?",
            "why": "\uC788\uB2E4 juga menanyakan keberadaan tempat"
          },
          {
            "ko": "\uD55C\uAD6D\uC5B4 \uC0AC\uC804\uC774 \uC788\uC5B4\uC694.",
            "rom": "hangugeo sajeon-i isseoyo.",
            "id": "Ada kamus bahasa Korea.",
            "why": "\uC0AC\uC804 berakhiran \u3134 \u2192 \uC774"
          }
        ]
      },
      {
        "type": "note",
        "text": "\uC788\uC5B4\uC694 dan \uC5C6\uC5B4\uC694 memakai subjek \uC774/\uAC00, bukan objek \uC744/\uB97C. Jadi waktu tidak ada adalah \uC2DC\uAC04\uC774 \uC5C6\uC5B4\uC694."
      }
    ],
    "quiz": [
      {
        "q": "Lengkapi: \uC2DC\uAC04___ \uC5C6\uC5B4\uC694.",
        "options": [
          "\uAC00",
          "\uC774",
          "\uB97C",
          "\uB294"
        ],
        "answer": 1,
        "why": "\uC788\uB2E4 dan \uC5C6\uB2E4 memakai \uC774/\uAC00. \uC2DC\uAC04 berakhiran konsonan, jadi memakai \uC774."
      },
      {
        "q": "Lengkapi: \uBB3C___ \uC788\uC5B4\uC694.",
        "options": [
          "\uAC00",
          "\uB294",
          "\uC774",
          "\uB97C"
        ],
        "answer": 2,
        "why": "\uBB3C berakhiran konsonan \u3139, jadi memakai \uC774."
      },
      {
        "q": "\uC800\uB294 \uB3D9\uC0DD\uC774 \uC788\uC5B4\uC694 berarti\u2026",
        "options": [
          "Adik saya ada di sini.",
          "Saya adalah adik.",
          "Adik saya pergi.",
          "Saya punya adik."
        ],
        "answer": 3,
        "why": "\uC788\uC5B4\uC694 juga berarti mempunyai, dan yang dimiliki adalah \uB3D9\uC0DD (adik)."
      },
      {
        "q": "Bentuk sopan dari \uC5C6\uB2E4 adalah\u2026",
        "options": [
          "\uC5C6\uC5B4\uC694",
          "\uC5C6\uC11C\uC694",
          "\uC5C6\uC608\uC694",
          "\uC5C6\uC774\uACE0"
        ],
        "answer": 0,
        "why": "\uC5C6\uB2E4 berubah menjadi \uC5C6\uC5B4\uC694, sedangkan \uC788\uB2E4 menjadi \uC788\uC5B4\uC694."
      },
      {
        "q": "Kalimat yang salah adalah\u2026",
        "options": [
          "\uC800\uB294 \uC2DC\uAC04\uC774 \uC5C6\uC5B4\uC694.",
          "\uC800\uB294 \uC2DC\uAC04\uC744 \uC5C6\uC5B4\uC694.",
          "\uBB3C\uC774 \uC788\uC5B4\uC694.",
          "\uB3D9\uC0DD\uC774 \uC5C6\uC5B4\uC694."
        ],
        "answer": 1,
        "why": "\uC5C6\uB2E4 tidak mengambil objek \uC744/\uB97C, melainkan subjek \uC774/\uAC00."
      },
      {
        "q": "\u201CDi mana toilet?\u201D dalam bahasa Korea\u2026",
        "options": [
          "\uD654\uC7A5\uC2E4\uB97C \uC5B4\uB514\uC5D0 \uC788\uC5B4\uC694?",
          "\uD654\uC7A5\uC2E4\uC740 \uC5B4\uB514\uB97C \uC788\uC5B4\uC694?",
          "\uD654\uC7A5\uC2E4\uC774 \uC5B4\uB514\uC5D0 \uC788\uC5B4\uC694?",
          "\uD654\uC7A5\uC2E4\uC774 \uC5B4\uB514\uC5D0 \uC5C6\uC5B4\uC694?"
        ],
        "answer": 2,
        "why": "\uD654\uC7A5\uC2E4 + \uC774 karena berakhiran \u3139, lalu \uC5B4\uB514\uC5D0 \uC788\uC5B4\uC694."
      },
      {
        "q": "Mau bertanya apakah ada kamus, kalimatnya\u2026",
        "options": [
          "\uC0AC\uC804\uC744 \uC788\uC5B4\uC694?",
          "\uC0AC\uC804\uC774 \uC5C6\uC5B4\uC694?",
          "\uC0AC\uC804\uC740 \uC788\uC5B4\uC694\uB97C?",
          "\uC0AC\uC804\uC774 \uC788\uC5B4\uC694?"
        ],
        "answer": 3,
        "why": "Benda yang ditanyakan keberadaannya memakai \uC774/\uAC00: \uC0AC\uC804\uC774 \uC788\uC5B4\uC694?"
      }
    ],
    "lat": [
      {
        "ko": "\uC2DC\uAC04\uC774 \uC5C6\uC5B4\uC694.",
        "rom": "sigan-i eopseoyo.",
        "id": "Tidak ada waktu."
      },
      {
        "ko": "\uC800\uB294 \uB3D9\uC0DD\uC774 \uC788\uC5B4\uC694.",
        "rom": "jeo-neun dongsaeng-i isseoyo.",
        "id": "Saya punya adik."
      },
      {
        "ko": "\uD654\uC7A5\uC2E4\uC774 \uC5B4\uB514\uC5D0 \uC788\uC5B4\uC694?",
        "rom": "hwajangsil-i eodie isseoyo?",
        "id": "Di mana toiletnya?"
      }
    ]
  },
  {
    "id": "ayo-eoyo",
    "no": 8,
    "title": "\uC544\uC694/\uC5B4\uC694 \u2014 Kata kerja sopan",
    "titleId": "Konjugasi \uD574\uC694\uCCB4",
    "level": 2,
    "icon": "\uC694",
    "intro": "Buang \uB2E4, lihat vokal terakhirnya: \u314F atau \u3157 memakai \uC544\uC694, lainnya \uC5B4\uC694.",
    "blocks": [
      {
        "type": "heading",
        "text": "Langkah konjugasi"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "Langkah 1",
            "b": "buang \uB2E4",
            "c": "\uBA39\uB2E4 \u2192 \uBA39, \uAC00\uB2E4 \u2192 \uAC00"
          },
          {
            "a": "Langkah 2",
            "b": "lihat vokal terakhir",
            "c": "\u314F dan \u3157 memakai \uC544\uC694"
          },
          {
            "a": "Langkah 3",
            "b": "vokal lain memakai \uC5B4\uC694",
            "c": "\u3153 \u315C \u3161 \u3163"
          },
          {
            "a": "Langkah 4",
            "b": "\uD558\uB2E4 \u2192 \uD574\uC694",
            "c": "\uACF5\uBD80\uD558\uB2E4 \u2192 \uACF5\uBD80\uD574\uC694"
          }
        ]
      },
      {
        "type": "heading",
        "text": "Vokal yang menyatu"
      },
      {
        "type": "text",
        "text": "Bila vokal batang sama dengan vokal tambahan, keduanya melebur menjadi satu bunyi. Karena itu \uAC00 + \uC544\uC694 menjadi \uAC00\uC694, dan \uBCF4 + \uC544\uC694 menjadi \uBD10\uC694."
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uBA39\uB2E4 \u2192 \uBA39\uC5B4\uC694",
            "rom": "meokda \u2192 meogeoyo",
            "id": "makan",
            "why": "vokal \u3153 memakai \uC5B4\uC694"
          },
          {
            "ko": "\uAC00\uB2E4 \u2192 \uAC00\uC694",
            "rom": "gada \u2192 gayo",
            "id": "pergi",
            "why": "\uAC00 + \uC544\uC694 melebur"
          },
          {
            "ko": "\uBCF4\uB2E4 \u2192 \uBD10\uC694",
            "rom": "boda \u2192 bwayo",
            "id": "melihat",
            "why": "\uBCF4 + \uC544\uC694 menjadi \uBD10\uC694"
          },
          {
            "ko": "\uBC30\uC6B0\uB2E4 \u2192 \uBC30\uC6CC\uC694",
            "rom": "baeuda \u2192 baewoyo",
            "id": "belajar",
            "why": "\uC6B0 menyatu menjadi \uC6CC"
          },
          {
            "ko": "\uB9C8\uC2DC\uB2E4 \u2192 \uB9C8\uC154\uC694",
            "rom": "masida \u2192 masyeoyo",
            "id": "minum",
            "why": "\uC2DC + \uC5B4 menjadi \uC154"
          },
          {
            "ko": "\uACF5\uBD80\uD558\uB2E4 \u2192 \uACF5\uBD80\uD574\uC694",
            "rom": "gongbuhada \u2192 gongbuhaeyo",
            "id": "belajar",
            "why": "\uD558\uB2E4 \u2192 \uD574\uC694"
          },
          {
            "ko": "\uAE30\uB2E4\uB9AC\uB2E4 \u2192 \uAE30\uB2E4\uB824\uC694",
            "rom": "gidarida \u2192 gidaryeoyo",
            "id": "menunggu",
            "why": "\uB9AC + \uC5B4 menjadi \uB824"
          }
        ]
      },
      {
        "type": "heading",
        "text": "Kata sifat memakai aturan yang sama"
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uD06C\uB2E4 \u2192 \uCEE4\uC694",
            "rom": "keuda \u2192 keoyo",
            "id": "besar",
            "why": "\u3161 melebur"
          },
          {
            "ko": "\uBC14\uC058\uB2E4 \u2192 \uBC14\uBE60\uC694",
            "rom": "bappeuda \u2192 bappayo",
            "id": "sibuk",
            "why": "\u3161 melebur"
          },
          {
            "ko": "\uC7AC\uBBF8\uC788\uB2E4 \u2192 \uC7AC\uBBF8\uC788\uC5B4\uC694",
            "rom": "jaemiitda \u2192 jaemiisseoyo",
            "id": "menarik"
          },
          {
            "ko": "\uC5B4\uB835\uB2E4 \u2192 \uC5B4\uB824\uC6CC\uC694",
            "rom": "eoryeopda \u2192 eoryeowoyo",
            "id": "sulit"
          }
        ]
      },
      {
        "type": "note",
        "text": "Mulai dari lima kata kerja ini: \uAC00\uC694 (pergi), \uC640\uC694 (datang), \uBA39\uC5B4\uC694 (makan), \uBD10\uC694 (melihat), \uD574\uC694 (melakukan). Pola ini membuka ribuan kalimat."
      }
    ],
    "quiz": [
      {
        "q": "Bentuk \uD574\uC694\uCCB4 dari \uBA39\uB2E4 adalah\u2026",
        "options": [
          "\uBA39\uC5B4\uC694",
          "\uBA39\uC544\uC694",
          "\uBA39\uC694",
          "\uBA39\uD574\uC694"
        ],
        "answer": 0,
        "why": "Batang \uBA39 berakhiran vokal \u3153, jadi memakai \uC5B4\uC694."
      },
      {
        "q": "Bentuk \uD574\uC694\uCCB4 dari \uAC00\uB2E4 adalah\u2026",
        "options": [
          "\uAC00\uC544\uC694",
          "\uAC00\uC694",
          "\uAC38\uC694",
          "\uAC00\uC5B4\uC694"
        ],
        "answer": 1,
        "why": "\uAC00 + \uC544\uC694 melebur menjadi \uAC00\uC694."
      },
      {
        "q": "Kata kerja \uD558\uB2E4 menjadi\u2026",
        "options": [
          "\uD558\uC544\uC694",
          "\uD558\uC694",
          "\uD574\uC694",
          "\uD558\uC5B4\uC694"
        ],
        "answer": 2,
        "why": "\uD558\uB2E4 adalah pola khusus: \uD558 + \uC5EC menjadi \uD574\uC694. Semua kata berakhiran \uD558\uB2E4 mengikuti aturan ini."
      },
      {
        "q": "Bentuk \uD574\uC694\uCCB4 dari \uBCF4\uB2E4 adalah\u2026",
        "options": [
          "\uBCF4\uC544\uC694",
          "\uBCF4\uC694",
          "\uBCF4\uC5B4\uC694",
          "\uBD10\uC694"
        ],
        "answer": 3,
        "why": "\uBCF4 + \uC544\uC694 melebur menjadi \uBD10\uC694 (bwayo). Bentuk \uBCF4\uC544\uC694 juga dipakai, tetapi percakapan lebih sering memakai \uBD10\uC694."
      },
      {
        "q": "Vokal batang mana yang memakai \uC544\uC694?",
        "options": [
          "\u314F dan \u3157",
          "\u3153 dan \u315C",
          "\u3163",
          "\u3161"
        ],
        "answer": 0,
        "why": "\uC544\uC694 dipakai bila vokal terakhir batang adalah \u314F atau \u3157. Selain itu memakai \uC5B4\uC694."
      },
      {
        "q": "Bentuk \uD574\uC694\uCCB4 dari \uACF5\uBD80\uD558\uB2E4 adalah\u2026",
        "options": [
          "\uACF5\uBD80\uD558\uC694",
          "\uACF5\uBD80\uD574\uC694",
          "\uACF5\uBD80\uC544\uC694",
          "\uACF5\uBD80\uD574\uC694\uC694"
        ],
        "answer": 1,
        "why": "Kata berakhiran \uD558\uB2E4 berubah menjadi \uD574\uC694: \uACF5\uBD80\uD574\uC694."
      },
      {
        "q": "Bentuk \uD574\uC694\uCCB4 dari \uB9C8\uC2DC\uB2E4 adalah\u2026",
        "options": [
          "\uB9C8\uC2DC\uC544\uC694",
          "\uB9C8\uC2DC\uC694",
          "\uB9C8\uC154\uC694",
          "\uB9C8\uC11C\uC694"
        ],
        "answer": 2,
        "why": "\uC2DC + \uC5B4\uC694 menjadi \uC154\uC694, jadi \uB9C8\uC154\uC694."
      },
      {
        "q": "Kata sifat \uD06C\uB2E4 (besar) menjadi\u2026",
        "options": [
          "\uD06C\uC5B4\uC694",
          "\uD06C\uC544\uC694",
          "\uCEE4\uC5B4\uC694",
          "\uCEE4\uC694"
        ],
        "answer": 3,
        "why": "Vokal \u3161 menyatu dengan \uC5B4 menjadi \uCEE4\uC694."
      },
      {
        "q": "Bentuk \uD574\uC694\uCCB4 dari \uAE30\uB2E4\uB9AC\uB2E4 adalah\u2026",
        "options": [
          "\uAE30\uB2E4\uB824\uC694",
          "\uAE30\uB2E4\uB9AC\uC5B4\uC694",
          "\uAE30\uB2E4\uB9AC\uC544\uC694",
          "\uAE30\uB2E4\uB9AC\uC694"
        ],
        "answer": 0,
        "why": "\uB9AC + \uC5B4 menyatu menjadi \uB824, jadi \uAE30\uB2E4\uB824\uC694."
      }
    ],
    "lat": [
      {
        "ko": "\uBA39\uC5B4\uC694",
        "rom": "meogeoyo",
        "id": "makan"
      },
      {
        "ko": "\uAC00\uC694",
        "rom": "gayo",
        "id": "pergi"
      },
      {
        "ko": "\uACF5\uBD80\uD574\uC694",
        "rom": "gongbuhaeyo",
        "id": "belajar"
      },
      {
        "ko": "\uB9C8\uC154\uC694",
        "rom": "masyeoyo",
        "id": "minum"
      }
    ]
  },
  {
    "id": "angka",
    "no": 9,
    "title": "\uC22B\uC790 \u2014 Angka Sino dan asli",
    "titleId": "Dua sistem angka Korea",
    "level": 3,
    "icon": "\uC5F4",
    "intro": "Harga, tanggal, dan nomor memakai angka Sino; jumlah benda dan usia memakai angka asli.",
    "blocks": [
      {
        "type": "heading",
        "text": "Angka Sino-Korea (\uD55C\uC790\uC5B4 \uC22B\uC790)"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "1 \uC77C",
            "b": "2 \uC774",
            "c": "3 \uC0BC, 4 \uC0AC"
          },
          {
            "a": "5 \uC624",
            "b": "6 \uC721",
            "c": "7 \uCE60, 8 \uD314"
          },
          {
            "a": "9 \uAD6C",
            "b": "10 \uC2ED",
            "c": "100 \uBC31, 1.000 \uCC9C"
          },
          {
            "a": "10.000 \uB9CC",
            "b": "100.000 \uC2ED\uB9CC",
            "c": "1.000.000 \uBC31\uB9CC"
          }
        ]
      },
      {
        "type": "text",
        "text": "Angka Sino tidak berubah bentuk. Dipakai untuk uang, nomor telepon, tanggal, menit, dan angka besar."
      },
      {
        "type": "heading",
        "text": "Angka asli Korea (\uACE0\uC720\uC5B4 \uC22B\uC790)"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "1 \uD558\uB098",
            "b": "2 \uB458",
            "c": "3 \uC14B"
          },
          {
            "a": "4 \uB137",
            "b": "5 \uB2E4\uC12F",
            "c": "6 \uC5EC\uC12F"
          },
          {
            "a": "7 \uC77C\uACF1",
            "b": "8 \uC5EC\uB35F",
            "c": "9 \uC544\uD649"
          },
          {
            "a": "10 \uC5F4",
            "b": "20 \uC2A4\uBB3C",
            "c": "30 \uC11C\uB978, 40 \uB9C8\uD754"
          }
        ]
      },
      {
        "type": "text",
        "text": "Angka asli berubah bentuk sebelum satuan: \uC14B menjadi \uC138, \uB137 menjadi \uB124, \uC2A4\uBB3C menjadi \uC2A4\uBB34. Contohnya \uC138 \uAC1C (tiga buah), \uB124 \uBA85 (empat orang), dan \uC2A4\uBB34 \uC0B4 (dua puluh tahun)."
      },
      {
        "type": "heading",
        "text": "Satuan hitung umum"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "\uAC1C",
            "b": "buah, untuk benda",
            "c": "\uC0AC\uACFC \uB450 \uAC1C = dua apel"
          },
          {
            "a": "\uBA85 / \uBD84",
            "b": "orang, \uBD84 lebih hormat",
            "c": "\uC138 \uBA85 = tiga orang"
          },
          {
            "a": "\uC794",
            "b": "gelas atau cangkir",
            "c": "\uCEE4\uD53C \uD55C \uC794 = satu cangkir kopi"
          },
          {
            "a": "\uC0B4",
            "b": "usia",
            "c": "\uC2A4\uBB34 \uC0B4 = dua puluh tahun"
          },
          {
            "a": "\uC2DC",
            "b": "jam, pukul",
            "c": "\uC138 \uC2DC = pukul tiga"
          }
        ]
      },
      {
        "type": "note",
        "text": "Untuk menanyakan jumlah dipakai \uBA87: \uBA87 \uC0B4\uC774\uC5D0\uC694? (berapa umurnya?), \uBA87 \uC2DC\uC608\uC694? (jam berapa?), \uBA87 \uAC1C\uC608\uC694? (berapa buah?)."
      }
    ],
    "quiz": [
      {
        "q": "Angka Sino untuk 3 adalah\u2026",
        "options": [
          "\uC14B",
          "\uC0BC",
          "\uC138",
          "\uC11C"
        ],
        "answer": 1,
        "why": "Tiga dalam angka Sino adalah \uC0BC (sam). Angka asli tiga adalah \uC14B, yang berubah menjadi \uC138 sebelum satuan."
      },
      {
        "q": "Usia dua puluh tahun diucapkan\u2026",
        "options": [
          "\uC774\uC2ED \uC0B4",
          "\uC2A4\uBB3C \uC0B4",
          "\uC2A4\uBB34 \uC0B4",
          "\uC2A4\uBB3C\uC774 \uC0B4"
        ],
        "answer": 2,
        "why": "Usia memakai angka asli, dan \uC2A4\uBB3C berubah menjadi \uC2A4\uBB34 sebelum \uC0B4."
      },
      {
        "q": "Dua buah apel diucapkan\u2026",
        "options": [
          "\uC0AC\uACFC \uC774 \uAC1C",
          "\uC0AC\uACFC \uB450 \uBA85",
          "\uC0AC\uACFC \uB450 \uC2DC",
          "\uC0AC\uACFC \uB450 \uAC1C"
        ],
        "answer": 3,
        "why": "Jumlah benda memakai angka asli (\uB450) dan satuan \uAC1C."
      },
      {
        "q": "Harga tiga ribu won diucapkan\u2026",
        "options": [
          "\uC0BC\uCC9C \uC6D0",
          "\uC138\uCC9C \uC6D0",
          "\uC14B\uCC9C \uC6D0",
          "\uC0AC\uCC9C \uC6D0"
        ],
        "answer": 0,
        "why": "Uang memakai angka Sino: \uC0BC (3) + \uCC9C (1.000) + \uC6D0."
      },
      {
        "q": "Angka asli 4 (\uB137) berubah menjadi apa sebelum satuan?",
        "options": [
          "\uB137",
          "\uB124",
          "\uC0AC",
          "\uB137\uC774"
        ],
        "answer": 1,
        "why": "\uB137 berubah menjadi \uB124 sebelum satuan, misalnya \uB124 \uBA85 (empat orang)."
      },
      {
        "q": "Satuan untuk menghitung orang adalah\u2026",
        "options": [
          "\uAC1C",
          "\uC794",
          "\uBA85",
          "\uC2DC"
        ],
        "answer": 2,
        "why": "\uBA85 menghitung orang, atau \uBD84 untuk bentuk hormat. \uAC1C untuk benda, \uC794 untuk gelas, \uC2DC untuk jam."
      },
      {
        "q": "\u201CJam berapa?\u201D dalam bahasa Korea\u2026",
        "options": [
          "\uBA87 \uAC1C\uC608\uC694?",
          "\uBA87 \uC0B4\uC774\uC5D0\uC694?",
          "\uBA87 \uBA85\uC774\uC5D0\uC694?",
          "\uBA87 \uC2DC\uC608\uC694?"
        ],
        "answer": 3,
        "why": "\uBA87 berarti berapa dan \uC2DC berarti jam, jadi \uBA87 \uC2DC\uC608\uC694?"
      },
      {
        "q": "Nomor telepon biasanya memakai angka\u2026",
        "options": [
          "Sino",
          "asli",
          "campuran acak",
          "huruf Latin"
        ],
        "answer": 0,
        "why": "Nomor telepon, uang, tanggal, dan jam memakai angka Sino."
      }
    ],
    "lat": [
      {
        "ko": "\uC14B",
        "rom": "set",
        "id": "tiga (asli)"
      },
      {
        "ko": "\uC0BC",
        "rom": "sam",
        "id": "tiga (Sino)"
      },
      {
        "ko": "\uC2A4\uBB34 \uC0B4",
        "rom": "seumu sal",
        "id": "dua puluh tahun"
      }
    ]
  },
  {
    "id": "lampau",
    "no": 10,
    "title": "\uC558\uC5B4\uC694/\uC5C8\uC5B4\uC694 \u2014 Masa lalu",
    "titleId": "Masa lalu dan negasi",
    "level": 3,
    "icon": "\uACFC",
    "intro": "Sisipkan \uC558 atau \uC5C8 di depan \uC5B4\uC694 untuk menceritakan hal yang sudah terjadi.",
    "blocks": [
      {
        "type": "heading",
        "text": "Rumus masa lalu"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "vokal \u314F dan \u3157",
            "b": "+ \uC558\uC5B4\uC694",
            "c": "\uAC00\uB2E4 \u2192 \uAC14\uC5B4\uC694"
          },
          {
            "a": "vokal lain",
            "b": "+ \uC5C8\uC5B4\uC694",
            "c": "\uBA39\uB2E4 \u2192 \uBA39\uC5C8\uC5B4\uC694"
          },
          {
            "a": "\uD558\uB2E4",
            "b": "\u2192 \uD588\uC5B4\uC694",
            "c": "\uACF5\uBD80\uD558\uB2E4 \u2192 \uACF5\uBD80\uD588\uC5B4\uC694"
          }
        ]
      },
      {
        "type": "text",
        "text": "Aturannya sama seperti \uC544\uC694 dan \uC5B4\uC694, hanya disisipi \uC558 atau \uC5C8. Bila vokal batang sudah sama, keduanya menyatu: \uAC00 + \uC558\uC5B4\uC694 menjadi \uAC14\uC5B4\uC694."
      },
      {
        "type": "heading",
        "text": "Contoh"
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uC5B4\uC81C \uC601\uD654\uB97C \uBD24\uC5B4\uC694.",
            "rom": "eoje yeonghwa-reul bwasseoyo.",
            "id": "Kemarin saya menonton film."
          },
          {
            "ko": "\uC544\uCE68\uC5D0 \uBE75\uC744 \uBA39\uC5C8\uC5B4\uC694.",
            "rom": "achime ppang-eul meogeosseoyo.",
            "id": "Pagi tadi saya makan roti."
          },
          {
            "ko": "\uC8FC\uB9D0\uC5D0 \uCE5C\uAD6C\uB97C \uB9CC\uB0AC\uC5B4\uC694.",
            "rom": "jumare chingu-reul mannasseoyo.",
            "id": "Akhir pekan saya bertemu teman."
          },
          {
            "ko": "\uD55C\uAD6D\uC5B4\uB97C \uACF5\uBD80\uD588\uC5B4\uC694.",
            "rom": "hangugeo-reul gongbuhaesseoyo.",
            "id": "Saya belajar bahasa Korea."
          },
          {
            "ko": "\uC5B4\uC81C \uC9D1\uC5D0 \uC788\uC5C8\uC5B4\uC694.",
            "rom": "eoje jib-e isseosseoyo.",
            "id": "Kemarin saya di rumah.",
            "why": "\uC788\uB2E4 \u2192 \uC788\uC5C8\uC5B4\uC694"
          }
        ]
      },
      {
        "type": "heading",
        "text": "Tiga cara menyatakan tidak"
      },
      {
        "type": "rules",
        "items": [
          {
            "a": "\uC548 + kata kerja",
            "b": "tidak melakukan",
            "c": "\uC548 \uBA39\uC5B4\uC694 = tidak makan"
          },
          {
            "a": "-\uC9C0 \uC54A\uC544\uC694",
            "b": "tidak melakukan, lebih sopan halus",
            "c": "\uBA39\uC9C0 \uC54A\uC544\uC694"
          },
          {
            "a": "\uBABB + kata kerja",
            "b": "tidak bisa",
            "c": "\uBABB \uAC00\uC694 = tidak bisa pergi"
          }
        ]
      },
      {
        "type": "examples",
        "items": [
          {
            "ko": "\uC800\uB294 \uACE0\uAE30\uB97C \uC548 \uBA39\uC5B4\uC694.",
            "rom": "jeo-neun gogi-reul an meogeoyo.",
            "id": "Saya tidak makan daging."
          },
          {
            "ko": "\uC624\uB298\uC740 \uD559\uAD50\uC5D0 \uBABB \uAC00\uC694.",
            "rom": "oneureun hakgyo-e mot gayo.",
            "id": "Hari ini saya tidak bisa ke sekolah."
          },
          {
            "ko": "\uADF8 \uC601\uD654\uB97C \uC548 \uBD24\uC5B4\uC694.",
            "rom": "geu yeonghwa-reul an bwasseoyo.",
            "id": "Saya tidak menonton film itu."
          }
        ]
      },
      {
        "type": "note",
        "text": "Kata \uC548 dan \uBABB diletakkan tepat sebelum kata kerja. Untuk kata berakhiran \uD558\uB2E4, \uBAA8\uC591nya \uACF5\uBD80 \uC548 \uD574\uC694 atau \uC548 \uACF5\uBD80\uD574\uC694, dan keduanya dipakai."
      }
    ],
    "quiz": [
      {
        "q": "Bentuk lampau dari \uBA39\uB2E4 adalah\u2026",
        "options": [
          "\uBA39\uC558\uC5B4\uC694",
          "\uBA39\uC5C8\uC5B4\uC694",
          "\uBA39\uACA0\uC5B4\uC694",
          "\uBA39\uC5B4\uC694"
        ],
        "answer": 1,
        "why": "Vokal \u3153 memakai \uC5C8\uC5B4\uC694, jadi \uBA39\uC5C8\uC5B4\uC694."
      },
      {
        "q": "Bentuk lampau dari \uAC00\uB2E4 adalah\u2026",
        "options": [
          "\uAC00\uC558\uC5B4\uC694",
          "\uAC14\uC558\uC5B4\uC694",
          "\uAC14\uC5B4\uC694",
          "\uAC00\uC694"
        ],
        "answer": 2,
        "why": "\uAC00 + \uC558\uC5B4\uC694 melebur menjadi \uAC14\uC5B4\uC694."
      },
      {
        "q": "Bentuk lampau dari \uACF5\uBD80\uD558\uB2E4 adalah\u2026",
        "options": [
          "\uACF5\uBD80\uD558\uC5C8\uC5B4\uC694",
          "\uACF5\uBD80\uD558\uC574\uC5B4\uC694",
          "\uACF5\uBD80\uD587\uC5B4\uC694",
          "\uACF5\uBD80\uD588\uC5B4\uC694"
        ],
        "answer": 3,
        "why": "\uD558\uB2E4 menjadi \uD588\uC5B4\uC694, jadi \uACF5\uBD80\uD588\uC5B4\uC694."
      },
      {
        "q": "\uC548 \uBA39\uC5B4\uC694 berarti\u2026",
        "options": [
          "tidak makan",
          "sudah makan",
          "akan makan",
          "tidak bisa makan"
        ],
        "answer": 0,
        "why": "\uC548 adalah negasi tidak melakukan. Untuk tidak bisa, dipakai \uBABB."
      },
      {
        "q": "Yang menyatakan \u201Ctidak bisa pergi\u201D adalah\u2026",
        "options": [
          "\uC548 \uAC00\uC694",
          "\uBABB \uAC00\uC694",
          "\uAC00\uC9C0 \uC54A\uC544\uC694",
          "\uAC14\uC5B4\uC694"
        ],
        "answer": 1,
        "why": "\uBABB menyatakan ketidakmampuan, sedangkan \uC548 menyatakan tidak melakukan."
      },
      {
        "q": "\u201CSaya tidak menonton film itu\u201D adalah\u2026",
        "options": [
          "\uADF8 \uC601\uD654\uB97C \uC548 \uBD10\uC694.",
          "\uADF8 \uC601\uD654\uB97C \uBD24\uC5B4\uC694 \uC548.",
          "\uADF8 \uC601\uD654\uB97C \uC548 \uBD24\uC5B4\uC694.",
          "\uADF8 \uC601\uD654\uB97C \uBD24\uC9C0 \uC54A\uC558\uC5B4\uC694."
        ],
        "answer": 2,
        "why": "Masa lalu dengan negasi: \uC548 + \uBD24\uC5B4\uC694 menjadi \uC548 \uBD24\uC5B4\uC694."
      },
      {
        "q": "Pola negasi panjang menggunakan\u2026",
        "options": [
          "-\uACE0 \uC2F6\uC5B4\uC694",
          "-\uC544\uC11C\uC694",
          "-\uC9C0\uB9CC",
          "-\uC9C0 \uC54A\uC544\uC694"
        ],
        "answer": 3,
        "why": "Kata kerja + \uC9C0 \uC54A\uC544\uC694 berarti tidak melakukan, misalnya \uBA39\uC9C0 \uC54A\uC544\uC694."
      },
      {
        "q": "\uC5B4\uC81C \uC9D1\uC5D0 \uC788\uC5C8\uC5B4\uC694 berarti\u2026",
        "options": [
          "Kemarin saya di rumah.",
          "Saya akan ke rumah.",
          "Saya tidak punya rumah.",
          "Rumahnya kemarin."
        ],
        "answer": 0,
        "why": "\uC788\uB2E4 menjadi \uC788\uC5C8\uC5B4\uC694 (masa lalu), dan \uC5B4\uC81C berarti kemarin."
      },
      {
        "q": "Letak kata \uC548 yang tepat adalah\u2026",
        "options": [
          "di akhir kalimat",
          "tepat sebelum kata kerja",
          "sebelum subjek",
          "setelah partikel objek"
        ],
        "answer": 1,
        "why": "Contohnya \uBC25\uC744 \uC548 \uBA39\uC5B4\uC694. Kata \uC548 menempel langsung di depan kata kerja."
      }
    ],
    "lat": [
      {
        "ko": "\uC5B4\uC81C \uC601\uD654\uB97C \uBD24\uC5B4\uC694.",
        "rom": "eoje yeonghwa-reul bwasseoyo.",
        "id": "Kemarin saya menonton film."
      },
      {
        "ko": "\uC800\uB294 \uACE0\uAE30\uB97C \uC548 \uBA39\uC5B4\uC694.",
        "rom": "jeo-neun gogi-reul an meogeoyo.",
        "id": "Saya tidak makan daging."
      },
      {
        "ko": "\uC624\uB298\uC740 \uD559\uAD50\uC5D0 \uBABB \uAC00\uC694.",
        "rom": "oneureun hakgyo-e mot gayo.",
        "id": "Hari ini saya tidak bisa ke sekolah."
      }
    ]
  }
];
