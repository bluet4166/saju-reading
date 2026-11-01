/* 자동 생성 파일 — tools/generate-data.mjs 로 재생성하세요 */
window.SAJU_DATA = {
  "meta": {
    "generatedAt": "2026-11-01T02:20:55.098Z",
    "engine": "saju-fortune (npm) — 로컬 계산, MCP 미사용",
    "converter": "KASI 음양력 데이터 기반 (korean-lunar-calendar). 2024년 추석 대조 검증 완료",
    "disclaimer": "이 페이지는 전통 해석에 기반한 참고 자료입니다. 의료·투자·법률 판단을 대신하지 않으며, 점수는 길흉의 확정이 아니라 상대적 흐름을 보여 주는 지표입니다.",
    "scoreModel": {
      "formula": "연도점수 = 50 + (천간값×w + 지지값×0.8×w)×1.6 + 대운보정",
      "aggregation": "5년 구간 점수 = 해당 구간 연도 점수의 평균",
      "elementBase": {
        "wood": {
          "value": 10,
          "reason": "용신(1순위)",
          "count": 2
        },
        "fire": {
          "value": 8,
          "reason": "희신(2순위)·부족 보완",
          "count": 1
        },
        "earth": {
          "value": -2,
          "reason": "식상 과다 — 설기·소모",
          "count": 2
        },
        "metal": {
          "value": 2,
          "reason": "재성 — 재물의 그릇(과다 아님)",
          "count": 2
        },
        "water": {
          "value": -5,
          "reason": "구신 — 일간을 극하고 부족",
          "count": 1
        }
      },
      "weights": {
        "love": {
          "wood": 1,
          "fire": 1.3,
          "earth": 0.6,
          "metal": 0.7,
          "water": 0.9
        },
        "career": {
          "wood": 1,
          "fire": 0.8,
          "earth": 1.1,
          "metal": 1.2,
          "water": 0.9
        },
        "money": {
          "wood": 0.6,
          "fire": 0.7,
          "earth": 1,
          "metal": 1.5,
          "water": 0.8
        },
        "health": {
          "wood": 1.1,
          "fire": 1.2,
          "earth": 0.9,
          "metal": 0.8,
          "water": 1.3
        }
      }
    }
  },
  "subject": {
    "name": "bluet4166",
    "lunar": "1974-08-18 (음력)",
    "solar": "1974-10-03",
    "time": "16:00",
    "timeLabel": "신시(申時, 15:30~17:30)",
    "gender": "female",
    "genderKo": "여성",
    "birthCity": null,
    "conversion": "KASI 음양력 데이터 기반 (korean-lunar-calendar). 2024년 추석 대조 검증 완료"
  },
  "pillars": [
    {
      "pos": "연주",
      "label": "갑인",
      "hanja": "甲寅",
      "stem": "갑",
      "stemHanja": "甲",
      "stemEl": "wood",
      "stemKo": "목",
      "branch": "인",
      "branchHanja": "寅",
      "branchEl": "wood",
      "branchKo": "목",
      "animal": "호랑이",
      "yinYang": "yang"
    },
    {
      "pos": "월주",
      "label": "계유",
      "hanja": "癸酉",
      "stem": "계",
      "stemHanja": "癸",
      "stemEl": "water",
      "stemKo": "수",
      "branch": "유",
      "branchHanja": "酉",
      "branchEl": "metal",
      "branchKo": "금",
      "animal": "닭",
      "yinYang": "yin"
    },
    {
      "pos": "일주",
      "label": "정축",
      "hanja": "丁丑",
      "stem": "정",
      "stemHanja": "丁",
      "stemEl": "fire",
      "stemKo": "화",
      "branch": "축",
      "branchHanja": "丑",
      "branchEl": "earth",
      "branchKo": "토",
      "animal": "소",
      "yinYang": "yin"
    },
    {
      "pos": "시주",
      "label": "무신",
      "hanja": "戊申",
      "stem": "무",
      "stemHanja": "戊",
      "stemEl": "earth",
      "stemKo": "토",
      "branch": "신",
      "branchHanja": "申",
      "branchEl": "metal",
      "branchKo": "금",
      "animal": "원숭이",
      "yinYang": "yang"
    }
  ],
  "dayMaster": {
    "stem": "정",
    "element": "fire",
    "elementKo": "화",
    "yinYang": "yin",
    "strength": "balanced"
  },
  "fiveElements": {
    "wood": 2,
    "fire": 1,
    "earth": 2,
    "metal": 2,
    "water": 1
  },
  "dominantElements": [
    "wood",
    "earth",
    "metal"
  ],
  "weakElements": [
    "fire",
    "water"
  ],
  "yongsin": {
    "primary": "wood",
    "primaryKo": "목(木)",
    "secondary": "fire",
    "secondaryKo": "화(火)",
    "reasoning": "화 일간의 강약과 오행 분포를 함께 보아 목(木) 기운을 우선 조율점으로 둡니다."
  },
  "daeun": [
    {
      "age": 48,
      "from": 2022,
      "to": 2031,
      "label": "무인",
      "hanja": "戊寅",
      "stemEl": "earth",
      "branchEl": "wood",
      "delta": 3
    },
    {
      "age": 58,
      "from": 2032,
      "to": 2041,
      "label": "기묘",
      "hanja": "己卯",
      "stemEl": "earth",
      "branchEl": "wood",
      "delta": 3
    },
    {
      "age": 68,
      "from": 2042,
      "to": 2051,
      "label": "경진",
      "hanja": "庚辰",
      "stemEl": "metal",
      "branchEl": "earth",
      "delta": 0
    },
    {
      "age": 78,
      "from": 2052,
      "to": 2061,
      "label": "신사",
      "hanja": "辛巳",
      "stemEl": "metal",
      "branchEl": "fire",
      "delta": 3
    },
    {
      "age": 88,
      "from": 2062,
      "to": 2071,
      "label": "임오",
      "hanja": "壬午",
      "stemEl": "water",
      "branchEl": "fire",
      "delta": 3
    },
    {
      "age": 98,
      "from": 2072,
      "to": 2081,
      "label": "계미",
      "hanja": "癸未",
      "stemEl": "water",
      "branchEl": "earth",
      "delta": -2
    }
  ],
  "currentDaeun": {
    "age": 48,
    "from": 2022,
    "to": 2031,
    "label": "무인",
    "hanja": "戊寅",
    "stemEl": "earth",
    "branchEl": "wood",
    "delta": 3
  },
  "buckets": [
    {
      "label": "2026–2030",
      "from": 2026,
      "to": 2030,
      "daeun": "무인",
      "daeunHanja": "戊寅",
      "scores": {
        "love": 62,
        "career": 58,
        "money": 58,
        "health": 61,
        "overall": 60
      },
      "bestYear": 2026,
      "bestScore": 76,
      "years": [
        {
          "year": 2026,
          "label": "병오",
          "scores": {
            "love": 83,
            "career": 71,
            "money": 69,
            "health": 81,
            "overall": 76
          }
        },
        {
          "year": 2027,
          "label": "정미",
          "scores": {
            "love": 68,
            "career": 60,
            "money": 59,
            "health": 66,
            "overall": 63
          }
        },
        {
          "year": 2028,
          "label": "무신",
          "scores": {
            "love": 53,
            "career": 53,
            "money": 54,
            "health": 52,
            "overall": 53
          }
        },
        {
          "year": 2029,
          "label": "기유",
          "scores": {
            "love": 53,
            "career": 53,
            "money": 54,
            "health": 52,
            "overall": 53
          }
        },
        {
          "year": 2030,
          "label": "경술",
          "scores": {
            "love": 54,
            "career": 54,
            "money": 55,
            "health": 53,
            "overall": 54
          }
        }
      ]
    },
    {
      "label": "2031–2035",
      "from": 2031,
      "to": 2035,
      "daeun": "무인",
      "daeunHanja": "戊寅",
      "scores": {
        "love": 59,
        "career": 60,
        "money": 56,
        "health": 58,
        "overall": 58
      },
      "bestYear": 2034,
      "bestScore": 80,
      "years": [
        {
          "year": 2031,
          "label": "신해",
          "scores": {
            "love": 49,
            "career": 51,
            "money": 53,
            "health": 47,
            "overall": 50
          }
        },
        {
          "year": 2032,
          "label": "임자",
          "scores": {
            "love": 40,
            "career": 40,
            "money": 41,
            "health": 34,
            "overall": 39
          }
        },
        {
          "year": 2033,
          "label": "계축",
          "scores": {
            "love": 44,
            "career": 43,
            "money": 44,
            "health": 40,
            "overall": 43
          }
        },
        {
          "year": 2034,
          "label": "갑인",
          "scores": {
            "love": 82,
            "career": 82,
            "money": 70,
            "health": 85,
            "overall": 80
          }
        },
        {
          "year": 2035,
          "label": "을묘",
          "scores": {
            "love": 82,
            "career": 82,
            "money": 70,
            "health": 85,
            "overall": 80
          }
        }
      ]
    },
    {
      "label": "2036–2040",
      "from": 2036,
      "to": 2040,
      "daeun": "기묘",
      "daeunHanja": "己卯",
      "scores": {
        "love": 64,
        "career": 59,
        "money": 59,
        "health": 63,
        "overall": 61
      },
      "bestYear": 2037,
      "bestScore": 76,
      "years": [
        {
          "year": 2036,
          "label": "병진",
          "scores": {
            "love": 68,
            "career": 60,
            "money": 59,
            "health": 66,
            "overall": 63
          }
        },
        {
          "year": 2037,
          "label": "정사",
          "scores": {
            "love": 83,
            "career": 71,
            "money": 69,
            "health": 81,
            "overall": 76
          }
        },
        {
          "year": 2038,
          "label": "무오",
          "scores": {
            "love": 64,
            "career": 58,
            "money": 57,
            "health": 62,
            "overall": 60
          }
        },
        {
          "year": 2039,
          "label": "기미",
          "scores": {
            "love": 50,
            "career": 47,
            "money": 47,
            "health": 48,
            "overall": 48
          }
        },
        {
          "year": 2040,
          "label": "경신",
          "scores": {
            "love": 57,
            "career": 60,
            "money": 62,
            "health": 58,
            "overall": 59
          }
        }
      ]
    },
    {
      "label": "2041–2045",
      "from": 2041,
      "to": 2045,
      "daeun": "기묘",
      "daeunHanja": "己卯",
      "scores": {
        "love": 52,
        "career": 52,
        "money": 50,
        "health": 50,
        "overall": 51
      },
      "bestYear": 2045,
      "bestScore": 62,
      "years": [
        {
          "year": 2041,
          "label": "신유",
          "scores": {
            "love": 57,
            "career": 60,
            "money": 62,
            "health": 58,
            "overall": 59
          }
        },
        {
          "year": 2042,
          "label": "임술",
          "scores": {
            "love": 41,
            "career": 40,
            "money": 41,
            "health": 37,
            "overall": 40
          }
        },
        {
          "year": 2043,
          "label": "계해",
          "scores": {
            "love": 37,
            "career": 37,
            "money": 38,
            "health": 31,
            "overall": 36
          }
        },
        {
          "year": 2044,
          "label": "갑자",
          "scores": {
            "love": 60,
            "career": 60,
            "money": 54,
            "health": 59,
            "overall": 58
          }
        },
        {
          "year": 2045,
          "label": "을축",
          "scores": {
            "love": 64,
            "career": 63,
            "money": 57,
            "health": 65,
            "overall": 62
          }
        }
      ]
    },
    {
      "label": "2046–2050",
      "from": 2046,
      "to": 2050,
      "daeun": "경진",
      "daeunHanja": "庚辰",
      "scores": {
        "love": 66,
        "career": 61,
        "money": 59,
        "health": 65,
        "overall": 63
      },
      "bestYear": 2046,
      "bestScore": 75,
      "years": [
        {
          "year": 2046,
          "label": "병인",
          "scores": {
            "love": 79,
            "career": 73,
            "money": 67,
            "health": 79,
            "overall": 75
          }
        },
        {
          "year": 2047,
          "label": "정묘",
          "scores": {
            "love": 79,
            "career": 73,
            "money": 67,
            "health": 79,
            "overall": 75
          }
        },
        {
          "year": 2048,
          "label": "무진",
          "scores": {
            "love": 47,
            "career": 44,
            "money": 44,
            "health": 45,
            "overall": 45
          }
        },
        {
          "year": 2049,
          "label": "기사",
          "scores": {
            "love": 61,
            "career": 55,
            "money": 54,
            "health": 59,
            "overall": 57
          }
        },
        {
          "year": 2050,
          "label": "경오",
          "scores": {
            "love": 66,
            "career": 62,
            "money": 62,
            "health": 65,
            "overall": 64
          }
        }
      ]
    }
  ],
  "yearly": [
    {
      "year": 2026,
      "stem": "병",
      "stemHanja": "丙",
      "stemEl": "fire",
      "branch": "오",
      "branchHanja": "午",
      "branchEl": "fire",
      "label": "병오",
      "hanja": "丙午",
      "daeun": "무인",
      "scores": {
        "love": 83,
        "career": 71,
        "money": 69,
        "health": 81,
        "overall": 76
      }
    },
    {
      "year": 2027,
      "stem": "정",
      "stemHanja": "丁",
      "stemEl": "fire",
      "branch": "미",
      "branchHanja": "未",
      "branchEl": "earth",
      "label": "정미",
      "hanja": "丁未",
      "daeun": "무인",
      "scores": {
        "love": 68,
        "career": 60,
        "money": 59,
        "health": 66,
        "overall": 63
      }
    },
    {
      "year": 2028,
      "stem": "무",
      "stemHanja": "戊",
      "stemEl": "earth",
      "branch": "신",
      "branchHanja": "申",
      "branchEl": "metal",
      "label": "무신",
      "hanja": "戊申",
      "daeun": "무인",
      "scores": {
        "love": 53,
        "career": 53,
        "money": 54,
        "health": 52,
        "overall": 53
      }
    },
    {
      "year": 2029,
      "stem": "기",
      "stemHanja": "己",
      "stemEl": "earth",
      "branch": "유",
      "branchHanja": "酉",
      "branchEl": "metal",
      "label": "기유",
      "hanja": "己酉",
      "daeun": "무인",
      "scores": {
        "love": 53,
        "career": 53,
        "money": 54,
        "health": 52,
        "overall": 53
      }
    },
    {
      "year": 2030,
      "stem": "경",
      "stemHanja": "庚",
      "stemEl": "metal",
      "branch": "술",
      "branchHanja": "戌",
      "branchEl": "earth",
      "label": "경술",
      "hanja": "庚戌",
      "daeun": "무인",
      "scores": {
        "love": 54,
        "career": 54,
        "money": 55,
        "health": 53,
        "overall": 54
      }
    },
    {
      "year": 2031,
      "stem": "신",
      "stemHanja": "辛",
      "stemEl": "metal",
      "branch": "해",
      "branchHanja": "亥",
      "branchEl": "water",
      "label": "신해",
      "hanja": "辛亥",
      "daeun": "무인",
      "scores": {
        "love": 49,
        "career": 51,
        "money": 53,
        "health": 47,
        "overall": 50
      }
    },
    {
      "year": 2032,
      "stem": "임",
      "stemHanja": "壬",
      "stemEl": "water",
      "branch": "자",
      "branchHanja": "子",
      "branchEl": "water",
      "label": "임자",
      "hanja": "壬子",
      "daeun": "기묘",
      "scores": {
        "love": 40,
        "career": 40,
        "money": 41,
        "health": 34,
        "overall": 39
      }
    },
    {
      "year": 2033,
      "stem": "계",
      "stemHanja": "癸",
      "stemEl": "water",
      "branch": "축",
      "branchHanja": "丑",
      "branchEl": "earth",
      "label": "계축",
      "hanja": "癸丑",
      "daeun": "기묘",
      "scores": {
        "love": 44,
        "career": 43,
        "money": 44,
        "health": 40,
        "overall": 43
      }
    },
    {
      "year": 2034,
      "stem": "갑",
      "stemHanja": "甲",
      "stemEl": "wood",
      "branch": "인",
      "branchHanja": "寅",
      "branchEl": "wood",
      "label": "갑인",
      "hanja": "甲寅",
      "daeun": "기묘",
      "scores": {
        "love": 82,
        "career": 82,
        "money": 70,
        "health": 85,
        "overall": 80
      }
    },
    {
      "year": 2035,
      "stem": "을",
      "stemHanja": "乙",
      "stemEl": "wood",
      "branch": "묘",
      "branchHanja": "卯",
      "branchEl": "wood",
      "label": "을묘",
      "hanja": "乙卯",
      "daeun": "기묘",
      "scores": {
        "love": 82,
        "career": 82,
        "money": 70,
        "health": 85,
        "overall": 80
      }
    },
    {
      "year": 2036,
      "stem": "병",
      "stemHanja": "丙",
      "stemEl": "fire",
      "branch": "진",
      "branchHanja": "辰",
      "branchEl": "earth",
      "label": "병진",
      "hanja": "丙辰",
      "daeun": "기묘",
      "scores": {
        "love": 68,
        "career": 60,
        "money": 59,
        "health": 66,
        "overall": 63
      }
    },
    {
      "year": 2037,
      "stem": "정",
      "stemHanja": "丁",
      "stemEl": "fire",
      "branch": "사",
      "branchHanja": "巳",
      "branchEl": "fire",
      "label": "정사",
      "hanja": "丁巳",
      "daeun": "기묘",
      "scores": {
        "love": 83,
        "career": 71,
        "money": 69,
        "health": 81,
        "overall": 76
      }
    },
    {
      "year": 2038,
      "stem": "무",
      "stemHanja": "戊",
      "stemEl": "earth",
      "branch": "오",
      "branchHanja": "午",
      "branchEl": "fire",
      "label": "무오",
      "hanja": "戊午",
      "daeun": "기묘",
      "scores": {
        "love": 64,
        "career": 58,
        "money": 57,
        "health": 62,
        "overall": 60
      }
    },
    {
      "year": 2039,
      "stem": "기",
      "stemHanja": "己",
      "stemEl": "earth",
      "branch": "미",
      "branchHanja": "未",
      "branchEl": "earth",
      "label": "기미",
      "hanja": "己未",
      "daeun": "기묘",
      "scores": {
        "love": 50,
        "career": 47,
        "money": 47,
        "health": 48,
        "overall": 48
      }
    },
    {
      "year": 2040,
      "stem": "경",
      "stemHanja": "庚",
      "stemEl": "metal",
      "branch": "신",
      "branchHanja": "申",
      "branchEl": "metal",
      "label": "경신",
      "hanja": "庚申",
      "daeun": "기묘",
      "scores": {
        "love": 57,
        "career": 60,
        "money": 62,
        "health": 58,
        "overall": 59
      }
    },
    {
      "year": 2041,
      "stem": "신",
      "stemHanja": "辛",
      "stemEl": "metal",
      "branch": "유",
      "branchHanja": "酉",
      "branchEl": "metal",
      "label": "신유",
      "hanja": "辛酉",
      "daeun": "기묘",
      "scores": {
        "love": 57,
        "career": 60,
        "money": 62,
        "health": 58,
        "overall": 59
      }
    },
    {
      "year": 2042,
      "stem": "임",
      "stemHanja": "壬",
      "stemEl": "water",
      "branch": "술",
      "branchHanja": "戌",
      "branchEl": "earth",
      "label": "임술",
      "hanja": "壬戌",
      "daeun": "경진",
      "scores": {
        "love": 41,
        "career": 40,
        "money": 41,
        "health": 37,
        "overall": 40
      }
    },
    {
      "year": 2043,
      "stem": "계",
      "stemHanja": "癸",
      "stemEl": "water",
      "branch": "해",
      "branchHanja": "亥",
      "branchEl": "water",
      "label": "계해",
      "hanja": "癸亥",
      "daeun": "경진",
      "scores": {
        "love": 37,
        "career": 37,
        "money": 38,
        "health": 31,
        "overall": 36
      }
    },
    {
      "year": 2044,
      "stem": "갑",
      "stemHanja": "甲",
      "stemEl": "wood",
      "branch": "자",
      "branchHanja": "子",
      "branchEl": "water",
      "label": "갑자",
      "hanja": "甲子",
      "daeun": "경진",
      "scores": {
        "love": 60,
        "career": 60,
        "money": 54,
        "health": 59,
        "overall": 58
      }
    },
    {
      "year": 2045,
      "stem": "을",
      "stemHanja": "乙",
      "stemEl": "wood",
      "branch": "축",
      "branchHanja": "丑",
      "branchEl": "earth",
      "label": "을축",
      "hanja": "乙丑",
      "daeun": "경진",
      "scores": {
        "love": 64,
        "career": 63,
        "money": 57,
        "health": 65,
        "overall": 62
      }
    },
    {
      "year": 2046,
      "stem": "병",
      "stemHanja": "丙",
      "stemEl": "fire",
      "branch": "인",
      "branchHanja": "寅",
      "branchEl": "wood",
      "label": "병인",
      "hanja": "丙寅",
      "daeun": "경진",
      "scores": {
        "love": 79,
        "career": 73,
        "money": 67,
        "health": 79,
        "overall": 75
      }
    },
    {
      "year": 2047,
      "stem": "정",
      "stemHanja": "丁",
      "stemEl": "fire",
      "branch": "묘",
      "branchHanja": "卯",
      "branchEl": "wood",
      "label": "정묘",
      "hanja": "丁卯",
      "daeun": "경진",
      "scores": {
        "love": 79,
        "career": 73,
        "money": 67,
        "health": 79,
        "overall": 75
      }
    },
    {
      "year": 2048,
      "stem": "무",
      "stemHanja": "戊",
      "stemEl": "earth",
      "branch": "진",
      "branchHanja": "辰",
      "branchEl": "earth",
      "label": "무진",
      "hanja": "戊辰",
      "daeun": "경진",
      "scores": {
        "love": 47,
        "career": 44,
        "money": 44,
        "health": 45,
        "overall": 45
      }
    },
    {
      "year": 2049,
      "stem": "기",
      "stemHanja": "己",
      "stemEl": "earth",
      "branch": "사",
      "branchHanja": "巳",
      "branchEl": "fire",
      "label": "기사",
      "hanja": "己巳",
      "daeun": "경진",
      "scores": {
        "love": 61,
        "career": 55,
        "money": 54,
        "health": 59,
        "overall": 57
      }
    },
    {
      "year": 2050,
      "stem": "경",
      "stemHanja": "庚",
      "stemEl": "metal",
      "branch": "오",
      "branchHanja": "午",
      "branchEl": "fire",
      "label": "경오",
      "hanja": "庚午",
      "daeun": "경진",
      "scores": {
        "love": 66,
        "career": 62,
        "money": 62,
        "health": 65,
        "overall": 64
      }
    }
  ],
  "topics": {
    "love": {
      "key": "love",
      "title": "연애운",
      "hanja": "緣",
      "accent": "#f472b6",
      "score": 83,
      "headline": "표현이 관계의 온도를 바꾸는 시기",
      "summary": "정화(丁火)는 크게 타오르기보다 곁을 데우는 불입니다. 애정 표현이 은근하고 상대가 먼저 알아채기를 기다리는 편이라, 마음은 깊어도 전달이 늦어질 수 있습니다. 부족한 화(火)를 채우는 해에는 그 표현의 문턱이 낮아집니다.",
      "strengths": [
        "한 사람에게 오래 집중하는 안정적인 애정",
        "상대의 컨디션을 먼저 읽는 섬세함",
        "말보다 행동으로 신뢰를 쌓는 힘"
      ],
      "cautions": [
        "서운함을 오래 담아두면 어느 순간 한 번에 터집니다",
        "확신이 설 때까지 기다리다 타이밍을 놓치기 쉽습니다",
        "돌봄이 과해지면 상대가 미안해하거나 부담을 느낄 수 있습니다"
      ],
      "advice": [
        "좋을 때 짧게라도 말로 표현하기 — 하루 한 문장이면 충분합니다",
        "서운함은 48시간 안에 꺼내는 규칙을 정해 보세요",
        "붉은 계열 소품, 꽃, 따뜻한 조명이 화 기운을 보완합니다"
      ]
    },
    "career": {
      "key": "career",
      "title": "사업운",
      "hanja": "業",
      "accent": "#fbbf24",
      "score": 71,
      "headline": "혼자 밀기보다 사람을 통해 완성되는 구조",
      "summary": "인성(갑·인)이 두 자리에 뿌리내려 기획·문서·교육·상담에서 강점이 나오고, 재성(유·신)이 실무 감각을 받쳐 줍니다. 시주의 상관(무토)은 표현과 추진을 더합니다. 즉 \"혼자 잘하는 일\"보다 \"정리해서 남에게 넘기는 일\"에서 성과가 커집니다.",
      "strengths": [
        "복잡한 것을 구조화해 설명하는 능력",
        "끝까지 마무리하는 책임감",
        "사람을 가르치고 키우는 데서 나오는 신뢰"
      ],
      "cautions": [
        "일을 다 떠안으면 정작 성과가 내 것이 되지 않습니다",
        "완벽을 기다리다 시작이 늦어질 수 있습니다",
        "감정 소모가 실무 판단을 흐릴 때가 있습니다"
      ],
      "advice": [
        "올해는 \"위임 목록\"을 문서로 만들어 두세요",
        "강의·자문·기획처럼 지식을 파는 형태와 궁합이 좋습니다",
        "큰 결정은 하루 묵혔다가 진행하세요"
      ]
    },
    "money": {
      "key": "money",
      "title": "금전운",
      "hanja": "財",
      "accent": "#4ade80",
      "score": 69,
      "headline": "버는 힘보다 지키는 규칙이 중요한 재물",
      "summary": "금(金)이 재성으로 두 개 있어 관리형 재물에 강합니다. 다만 편재(유금) 성향이라 한 번에 크게 굴리는 방식보다, 정해진 규칙으로 꾸준히 쌓는 쪽이 체질에 맞습니다. 목돈은 \"벌기\"보다 \"지키는 구조\"를 먼저 세우는 편이 안전합니다.",
      "strengths": [
        "새는 돈을 알아채는 감각",
        "고정 지출을 구조화하는 능력",
        "필요할 때를 위한 현금흐름 관리"
      ],
      "cautions": [
        "사람 좋아서 하는 지출이 반복됩니다",
        "변동성 큰 자산에 감정적으로 반응하기 쉽습니다",
        "보증·대여는 관계와 재물을 동시에 흔듭니다"
      ],
      "advice": [
        "수입의 일정 비율을 자동이체로 먼저 떼어 두세요",
        "투자 결정은 \"규칙을 적고 나서\" 실행하세요",
        "큰 지출 전 하루 대기 규칙이 특히 효과적입니다"
      ]
    },
    "health": {
      "key": "health",
      "title": "건강운",
      "hanja": "壽",
      "accent": "#60a5fa",
      "score": 81,
      "headline": "연료와 휴식, 두 가지가 함께 필요한 체질",
      "summary": "부족한 화(火)·수(水)는 전통적으로 순환(체온·심혈관·수면)과 수분·호르몬 축으로 읽습니다. 일이 많을 때보다 \"열을 내는 연료와 식히는 물\"이 없을 때 지침이 오는 구조입니다. 50대에는 이 축이 실제 컨디션과 겹치는 영역이라 규칙이 특히 중요합니다.",
      "strengths": [
        "증상이 오기 전에 몸의 신호를 먼저 감지하는 편",
        "한번 규칙을 만들면 오래 유지하는 힘"
      ],
      "cautions": [
        "갈증을 늦게 느껴 수분이 부족해지기 쉽습니다",
        "열을 내는 일에 몰입하면 회복을 뒤로 미룹니다",
        "수면 시간이 흔들리면 회복이 급격히 느려집니다"
      ],
      "advice": [
        "아침 햇빛 15분 — 화 기운과 생체리듬을 동시에",
        "물은 목마르기 전에 마시기 (하루 1.5L 이상)",
        "주 3회, 숨이 차는 유산소 20분 이상",
        "갱년기 관련 증상은 사주가 아니라 전문의 상담으로"
      ]
    }
  },
  "today": {
    "date": "2026-11-01",
    "summary": "목(木), 토(土), 금(金) 기운이 강하게 드러나므로 장점은 살리고 부족한 화(火), 수(水) 기운을 생활 루틴으로 보완하는 해석이 좋습니다."
  }
};
