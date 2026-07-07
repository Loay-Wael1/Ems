export const SUPPORTED_LOCALES = ['en', 'ar'] as const;
export const DEFAULT_LOCALE = 'en';

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const siteContent = {
  en: {
    meta: {
      title: "Easy Fit Alexandria | Alexandria's 1st EMS Studio",
      description:
        'Premium EMS fitness training in Alexandria. 20-minute coach-guided EMS sessions for body transformation, fat loss support, toning, strength, and smarter training.',
      schemaDescription: "Alexandria's 1st EMS Studio for 20-minute coach-guided EMS fitness sessions."
    },
    layout: {
      skipLink: 'Skip to main content'
    },
    header: {
      ariaLabel: 'Primary navigation',
      navAriaLabel: 'Page sections',
      brandSub: 'EMS Studios',
      nav: [
        { label: 'Results', href: '#results' },
        { label: 'Systems', href: '#what-is-ems' },
        { label: 'EMS', href: '#why-ems' },
        { label: 'Reviews', href: '#testimonials' },
        { label: 'Branches', href: '#locations' }
      ],
      languageSwitch: {
        label: 'العربية',
        ariaLabel: 'Switch language to Arabic'
      },
      bookTrial: 'Book Trial',
      bookShort: 'Book',
      bookAriaLabel: 'Book Trial'
    },
    hero: {
      title: 'Train smarter.',
      titleAccent: 'Transform faster.',
      description:
        'Get the results of a 4-hour gym workout in just one 20-minute weekly session. Experience coach-guided EMS designed to activate deep muscle fibers and save you time.',
      primaryCta: 'Book Your Trial Session',
      secondaryCta: 'See Transformations',
      badgesAriaLabel: 'Easy Fit highlights',
      badges: [
        { label: 'Smart 20-Minute EMS', href: '#what-is-ems' },
        { label: 'Expert Coaches & Nutrition', href: '#expert-coaches' },
        { label: 'Client Reviews', href: '#testimonials' },
        { label: 'Our Branches', href: '#locations' }
      ]
    },
    beforeAfter: {
      title: 'Progress that speaks for itself.',
      intro: 'Real client progress from focused EMS sessions, coaching, nutrition, and consistency.',
      trackAriaLabel: 'Client transformation examples',
      swipeHint: 'Swipe to see more results',
      disclaimer: 'Results vary depending on consistency, nutrition, and individual goals.',
      altSuffix: 'before and after progress at Easy Fit Alexandria',
      transformations: [
        { tag: 'Fat Loss Journey', title: 'Focused consistency' },
        { tag: 'Body Toning', title: 'Shape & confidence' },
        { tag: 'EMS Progress', title: 'Coach-guided change' },
        { tag: 'Strength & Shape', title: 'Stronger silhouette' },
        { tag: 'Body Toning', title: 'Visible progress' }
      ]
    },
    ems: {
      eyebrow: 'EMS SYSTEMS',
      title: '20 minutes EMS = 4 hours in the gym',
      intro: 'Three EMS systems. One smarter way to train, shape, and activate.',
      tablistLabel: 'EMS Systems',
      cta: 'Book the 20-Minute Trial',
      systems: [
        {
          name: 'I-MOTION',
          tagline: 'Full-body EMS for strength, movement, and transformation.',
          description: 'Built for active coach-guided sessions that activate the whole body in one efficient workout.',
          chipsLabel: 'I-MOTION features',
          chips: ['Full-body activation', 'Coach-guided', '20-minute format'],
          best: 'Best for full-body training and overall transformation.'
        },
        {
          name: 'I-MODEL',
          tagline: 'Targeted EMS for shaping and toning.',
          description: 'Designed to focus on areas like the abdomen, glutes, and thighs with more precise stimulation.',
          chipsLabel: 'I-MODEL features',
          chips: ['Targeted shaping', 'Toning support', 'Aesthetic sessions'],
          best: 'Best for contouring, toning, and body-shape goals.'
        },
        {
          name: 'I-SHAPE',
          tagline: 'Advanced lower-body EMS for glutes and legs.',
          description: 'A focused EMS system for lower-body definition and high-value shaping sessions.',
          chipsLabel: 'I-SHAPE features',
          chips: ['Lower-body focus', 'Glutes & legs', 'Premium shaping'],
          best: 'Best for glute focus and lower-body definition.'
        }
      ]
    },
    proof: {
      title: 'Why EMS feels different from a regular workout.',
      intro:
        'It is not about doing more exercises. It is about making every minute more targeted, more guided, and more connected to your goal.',
      cards: [
        {
          title: 'Deep muscle activation',
          text: 'EMS adds controlled impulses while you move, helping more muscle groups join the session with focused effort.'
        },
        {
          title: 'Coach-controlled intensity',
          text: 'Your coach adjusts the intensity zone by zone, so the session feels personal instead of random.'
        },
        {
          title: 'Full-body session in less time',
          text: 'The workout is short, structured, and designed to get the whole body working without wasting time.'
        },
        {
          title: 'Built around your goal',
          text: 'Fat loss support, toning, strength, or returning to training. The plan changes with your body.'
        }
      ]
    },
    coaches: {
      kicker: 'EXPERT GUIDANCE',
      title: 'Real coaches guide every EMS session.',
      intro:
        'From movement control to nutrition direction and InBody follow-ups, your 20-minute session is part of a guided plan — not a random workout.',
      privacyNote:
        'Private, same-gender coaching keeps every session comfortable: men train with male coaches, and women train with female coaches.',
      featuredDetail: 'Real guidance before you train',
      moreVideosLabel: 'More coach guidance videos',
      trustCards: [
        {
          title: 'Private PT coach sessions',
          text: 'Every movement, posture, and intensity level is guided by a dedicated personal coach.'
        },
        {
          title: 'Nutrition direction',
          text: 'You get practical nutrition support matched to your goal and progress.'
        },
        {
          title: 'InBody tracking',
          text: 'We track body composition, not just weight, so progress is easier to understand.'
        },
        {
          title: '14-day follow-up',
          text: 'Your plan is reviewed every 14 days and adjusted based on your body’s response.'
        }
      ],
      videos: [
        {
          label: 'Coach insight',
          ariaLabel: 'Easy Fit coach explaining EMS training guidance'
        },
        {
          label: 'Training guidance',
          detail: 'Technique cues while you train',
          ariaLabel: 'Easy Fit coach sharing EMS training guidance'
        },
        {
          label: 'Train smarter',
          detail: 'How EMS fits your routine',
          ariaLabel: 'Easy Fit coach explaining how EMS fits your routine'
        }
      ]
    },
    testimonials: {
      kicker: 'CLIENT FEEDBACK',
      title: 'Real people. Real results.',
      intro: 'Watch client stories and browse real feedback from Easy Fit Alexandria.',
      videoSubhead: 'Clients say',
      imageSubhead: 'Reviews',
      videoMarqueeLabel: 'Client video reviews',
      imageMarqueeLabel: 'Client review screenshots',
      controlsLabel: 'Review carousel controls',
      previousLabel: 'Show previous reviews',
      nextLabel: 'Show next reviews',
      ctaText: 'Feel the Power of EMS Training',
      ctaLabel: 'Book Your Trial',
      modalLabel: 'Client review preview',
      closeLabel: 'Close review preview',
      imageTitlePrefix: 'Client review',
      videoTitlePrefix: 'Client video review',
      openPrefix: 'Open',
      altSuffix: 'from Easy Fit Alexandria client',
      modalAltSuffix: 'from Easy Fit Alexandria'
    },
    locations: {
      title: 'Our Branches',
      intro: 'Smouha or Ganaklis — choose the branch that fits your day.',
      imageAltSuffix: 'Easy Fit Alexandria studio visual',
      actions: {
        whatsapp: 'WhatsApp',
        mobile: 'Call Mobile',
        landline: 'Call Landline',
        map: 'View on Map'
      },
      studios: [
        {
          name: 'Smouha',
          address: 'Delta Life Administrative Towers, behind Motager Mall, first floor, Studio 7B.',
          whatsappMessage:
            'Hello Easy Fit Alexandria, I came from the website and would like to ask about booking an EMS trial session at the Smouha branch.'
        },
        {
          name: 'Ganaklis',
          address: 'El Zeraeyeen Towers, ground floor, Abu Qir Street, in front of El Sallab.',
          whatsappMessage:
            'Hello Easy Fit Alexandria, I came from the website and would like to ask about booking an EMS trial session at the Ganaklis branch.'
        }
      ]
    },
    leadForm: {
      eyebrow: 'START YOUR EMS TRIAL',
      title: 'Ready for your 20-minute EMS trial?',
      intro: 'Pick your branch, leave your details, and our team will confirm your trial time.',
      cardTitle: 'Book your trial',
      labels: {
        name: 'Full name',
        phone: 'Phone number',
        branch: 'Preferred branch'
      },
      placeholders: {
        name: 'Your full name',
        phone: 'Your mobile number'
      },
      branchPlaceholder: 'Select your branch',
      branches: {
        smouha: 'Smouha',
        ganaklis: 'Ganaklis'
      },
      privacy: 'We will only use your details to contact you about your EMS trial.',
      submit: 'Request my trial session',
      loading: 'Sending request...',
      success: 'Your request has been received. We will contact you shortly.',
      error: 'Something went wrong. Please try again or message us on WhatsApp.'
    },
    finalCta: {
      brandSub: "Alexandria's 1st EMS Studio",
      socialLabel: 'Social and booking links',
      links: {
        facebook: 'Facebook',
        instagram: 'Instagram',
        whatsapp: 'WhatsApp'
      },
      copyright: '© 2026 Easy Fit Alexandria. All rights reserved.'
    }
  },
  ar: {
    meta: {
      title: 'Easy Fit Alexandria | أول EMS Studio في الإسكندرية',
      description:
        'تدريب EMS Premium في الإسكندرية: جلسات 20 دقيقة مع كوتش متخصص لمساعدتك على التمرين بذكاء، تنشيط العضلات بعمق، وتحسين شكل الجسم.',
      schemaDescription: 'أول EMS Studio في الإسكندرية لجلسات EMS موجهة مع كوتش متخصص في 20 دقيقة.'
    },
    layout: {
      skipLink: 'تخطي إلى المحتوى الرئيسي'
    },
    header: {
      ariaLabel: 'التنقل الرئيسي',
      navAriaLabel: 'أقسام الصفحة',
      brandSub: 'EMS Studios',
      nav: [
        { label: 'النتائج', href: '#results' },
        { label: 'الأنظمة', href: '#what-is-ems' },
        { label: 'ليه EMS؟', href: '#why-ems' },
        { label: 'آراء العملاء', href: '#testimonials' },
        { label: 'الفروع', href: '#locations' }
      ],
      languageSwitch: {
        label: 'English',
        ariaLabel: 'Switch language to English'
      },
      bookTrial: 'احجز تجربة',
      bookShort: 'احجز',
      bookAriaLabel: 'احجز تجربة EMS'
    },
    hero: {
      title: 'تمرّن بذكاء…',
      titleAccent: 'وشوف الفرق\u00A0أسرع.',
      description:
        'جلسة EMS موجهة مع كوتش متخصص في 20 دقيقة، مصممة لتنشيط العضلات بعمق وتوفير وقتك - من غير تمرين طويل في الجيم.',
      primaryCta: 'احجز تجربة EMS',
      secondaryCta: 'شوف التحوّلات',
      badgesAriaLabel: 'مميزات Easy Fit',
      badges: [
        { label: 'جلسة EMS ذكية في 20 دقيقة', href: '#what-is-ems' },
        { label: 'كوتش متخصص ومتابعة تغذية', href: '#expert-coaches' },
        { label: 'آراء العملاء', href: '#testimonials' },
        { label: 'فروعنا في الإسكندرية', href: '#locations' }
      ]
    },
    beforeAfter: {
      title: 'نتائج بتتكلم عن نفسها.',
      intro:
        'تحوّلات حقيقية من عملاء Easy Fit Alexandria مع جلسات EMS مركّزة، متابعة كوتش، وتوجيه غذائي يساعدك تكمل.',
      trackAriaLabel: 'أمثلة لتحولات عملاء Easy Fit',
      swipeHint: 'اسحب وشوف نتائج أكتر',
      disclaimer: 'النتائج تختلف حسب الالتزام، التغذية، وطبيعة كل جسم.',
      altSuffix: 'تحول قبل وبعد في Easy Fit Alexandria',
      transformations: [
        { tag: 'رحلة نزول دهون', title: 'التزام واضح' },
        { tag: 'شد وتناسق', title: 'شكل وثقة أكتر' },
        { tag: 'تقدّم مع EMS', title: 'تغيير بخطوات محسوبة' },
        { tag: 'قوة وتناسق', title: 'مظهر أقوى' },
        { tag: 'شد وتناسق', title: 'تقدم ملحوظ' }
      ]
    },
    ems: {
      eyebrow: 'أنظمة EMS',
      title: '20 دقيقة EMS ممكن تغيّر شكل تمرينك بالكامل',
      intro: 'ثلاث أنظمة EMS، كل واحد مصمم لهدف مختلف: حركة، شد، وتشكيل.',
      tablistLabel: 'أنظمة EMS',
      cta: 'احجز تجربة الـ20 دقيقة',
      systems: [
        {
          name: 'I-MOTION',
          tagline: 'EMS للجسم بالكامل، للحركة والقوة والتحوّل.',
          description: 'جلسة نشطة مع كوتش تساعد على تنشيط عضلات الجسم كله بكفاءة وفي وقت قصير.',
          chipsLabel: 'مميزات I-MOTION',
          chips: ['تنشيط كامل للجسم', 'متابعة كوتش', 'نظام 20 دقيقة'],
          best: 'الأفضل للتدريب الكامل وتحسين الشكل العام.'
        },
        {
          name: 'I-MODEL',
          tagline: 'EMS موجه للشد والتناسق.',
          description: 'مصمم للتركيز على مناطق محددة مثل البطن، الأرداف، والفخذين بتحكم أدق.',
          chipsLabel: 'مميزات I-MODEL',
          chips: ['تشكيل مركز', 'مساعدة على الشد', 'جلسات جمالية'],
          best: 'الأفضل لأهداف التناسق وتحديد شكل الجسم.'
        },
        {
          name: 'I-SHAPE',
          tagline: 'EMS متقدم للجزء السفلي: الأرداف والرجلين.',
          description: 'نظام مركز لمن يريد إبراز وتشكيل الجزء السفلي بجلسات عالية القيمة.',
          chipsLabel: 'مميزات I-SHAPE',
          chips: ['تركيز على الجزء السفلي', 'الأرداف والرجلين', 'تشكيل Premium'],
          best: 'الأفضل للتركيز على الأرداف وتحسين شكل الرجلين.'
        }
      ]
    },
    proof: {
      title: 'ليه EMS مختلف عن التمرين العادي؟',
      intro: 'الفكرة مش إنك تعمل تمارين أكتر. الفكرة إن كل دقيقة تبقى أذكى، أوضح، وموجهة لهدفك.',
      cards: [
        {
          title: 'تنشيط أعمق للعضلات',
          text: 'EMS يضيف نبضات محسوبة أثناء الحركة، فيساعد مجموعات عضلية أكتر تدخل في الجلسة.'
        },
        {
          title: 'تحكم كامل من الكوتش',
          text: 'الكوتش يظبط الشدة منطقة بمنطقة حسب جسمك وإحساسك.'
        },
        {
          title: 'جلسة كاملة في وقت أقل',
          text: 'تمرين قصير ومنظم يخلي الجسم كله يشتغل من غير وقت طويل في الجيم.'
        },
        {
          title: 'خطة حسب هدفك',
          text: 'نزول دهون، شد، قوة، أو رجوع للتمرين - الخطة بتتظبط مع تقدمك.'
        }
      ]
    },
    coaches: {
      kicker: 'متابعة متخصصة',
      title: 'جلسة EMS بإشراف فريق متخصص.',
      intro:
        'من ضبط الحركة والشدة، لتوجيه التغذية ومتابعة InBody، جلسة الـ20 دقيقة جزء من خطة واضحة - مش تمرين عشوائي.',
      privacyNote: 'خصوصية وراحة أكتر: الرجال مع كوتش رجال، والسيدات مع كوتش سيدات.',
      featuredDetail: 'توجيه حقيقي قبل ما تبدأ',
      moreVideosLabel: 'فيديوهات إضافية من الكوتش',
      trustCards: [
        {
          title: 'مدربون متخصصون',
          text: 'الجلسة تحت متابعة مدربين متخصصين من خلفية تربية رياضية، لمتابعة الحركة والوضعية ومستوى الشدة بأمان.'
        },
        {
          title: 'توجيه تغذية من فريق مؤهل',
          text: 'إرشاد غذائي عملي من متخصصين، منهم خريجو صيدلة، عشان الخطوات تناسب هدفك وتقدمك.'
        },
        {
          title: 'متابعة InBody دقيقة',
          text: 'بنقرأ تكوين الجسم معاك: دهون، عضلات، ومياه — مش الوزن بس — عشان التقدم يبقى واضح ومبني على قياس.'
        },
        {
          title: 'مراجعة كل 14 يوم',
          text: 'الفريق بيراجع قياساتك واستجابة جسمك كل 14 يوم، ويعدّل الخطة حسب النتيجة.'
        }
      ],
      videos: [
        {
          label: 'نصيحة من الكوتش',
          ariaLabel: 'كوتش Easy Fit يشرح توجيه تدريب EMS'
        },
        {
          label: 'توجيه في التمرين',
          detail: 'توجيه عملي أثناء الجلسة',
          ariaLabel: 'كوتش Easy Fit يشارك نصائح تدريب EMS'
        },
        {
          label: 'تمرّن بذكاء',
          detail: 'إزاي EMS يناسب يومك',
          ariaLabel: 'كوتش Easy Fit يشرح إزاي EMS يناسب روتينك'
        }
      ]
    },
    testimonials: {
      kicker: 'آراء العملاء',
      title: 'ناس حقيقية. نتائج حقيقية.',
      intro: 'شوف تجارب العملاء وآرائهم مع Easy Fit Alexandria.',
      videoSubhead: 'العملاء بيقولوا',
      imageSubhead: 'الريفيوهات',
      videoMarqueeLabel: 'فيديوهات آراء العملاء',
      imageMarqueeLabel: 'صور آراء العملاء',
      controlsLabel: 'أزرار تحريك آراء العملاء',
      previousLabel: 'عرض الآراء السابقة',
      nextLabel: 'عرض الآراء التالية',
      ctaText: 'جرّب قوة تمرين EMS',
      ctaLabel: 'احجز تجربتك',
      modalLabel: 'معاينة رأي العميل',
      closeLabel: 'إغلاق معاينة رأي العميل',
      imageTitlePrefix: 'رأي عميل',
      videoTitlePrefix: 'فيديو رأي عميل',
      openPrefix: 'افتح',
      altSuffix: 'من عميل Easy Fit Alexandria',
      modalAltSuffix: 'من Easy Fit Alexandria'
    },
    locations: {
      title: 'فروعنا',
      intro: 'سموحة أو جناكليس - اختار الفرع الأقرب ليومك.',
      imageAltSuffix: 'صورة فرع Easy Fit Alexandria',
      actions: {
        whatsapp: 'واتساب',
        mobile: 'اتصال موبايل',
        landline: 'اتصال أرضي',
        map: 'افتح الخريطة'
      },
      studios: [
        {
          name: 'سموحة',
          address: 'أبراج دلتا لايف الإدارية، خلف متاجر مول، الدور الأول، ستوديو 7B.',
          whatsappMessage: 'أهلًا Easy Fit Alexandria، وصلت لكم من الموقع وعايز أحجز تجربة EMS في فرع سموحة.'
        },
        {
          name: 'جناكليس',
          address: 'أبراج الزراعيين، الدور الأرضي، شارع أبو قير، أمام السلاب.',
          whatsappMessage: 'أهلًا Easy Fit Alexandria، وصلت لكم من الموقع وعايز أحجز تجربة EMS في فرع جناكليس.'
        }
      ]
    },
    leadForm: {
      eyebrow: 'ابدأ تجربة EMS',
      title: 'جاهز لتجربة EMS في 20 دقيقة؟',
      intro: 'اختار الفرع، سيب بياناتك، وفريقنا هيتواصل معاك لتأكيد ميعاد التجربة.',
      cardTitle: 'احجز تجربتك',
      labels: {
        name: 'الاسم بالكامل',
        phone: 'رقم الموبايل',
        branch: 'الفرع المفضل'
      },
      placeholders: {
        name: 'اكتب اسمك',
        phone: 'اكتب رقم الموبايل'
      },
      branchPlaceholder: 'اختار الفرع',
      branches: {
        smouha: 'سموحة',
        ganaklis: 'جناكليس'
      },
      privacy: 'هنستخدم بياناتك فقط للتواصل معاك بخصوص تجربة EMS.',
      submit: 'اطلب جلسة التجربة',
      loading: 'جاري إرسال الطلب...',
      success: 'تم استلام طلبك. هنتواصل معاك قريبًا.',
      error: 'حصلت مشكلة. حاول مرة كمان أو ابعتلنا على واتساب.'
    },
    finalCta: {
      brandSub: 'أول EMS Studio في الإسكندرية',
      socialLabel: 'روابط التواصل والحجز',
      links: {
        facebook: 'فيسبوك',
        instagram: 'إنستجرام',
        whatsapp: 'واتساب'
      },
      copyright: '© 2026 Easy Fit Alexandria. جميع الحقوق محفوظة.'
    }
  }
} as const;
