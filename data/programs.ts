// Единый список программ IPAS.
// Каждая программа имеет развёрнутое описание (~2 листа A4) + блоки modules/outcomes/audience.
// Наполнение — на основе IPI с атрибуцией, адаптировано под фирменный сертификат IPAS
// (подписывает Robin Mackay, President of the Council).

export interface ProgramModule {
  title: string;
  items: string[];
}

export interface Program {
  slug: string;
  title: string;
  hours?: number;
  duration?: string;
  format: 'in-person' | 'online' | 'hybrid' | 'videoconference' | 'distance';
  level: 'foundational' | 'advanced' | 'specialist' | 'continuing';
  summary: string;
  /** Многоабзацное описание программы — показывается как главный текст на странице детали. */
  description: string[];
  /** Ключевые темы — короткий список для обзора. */
  topics: string[];
  /** Целевая аудитория. */
  audience: string;
  /** Результаты обучения. */
  outcomes: string[];
  /** Структура программы по модулям. */
  modules?: ProgramModule[];
  hosted_by: 'ipas';
  source?: { name: string; url: string };
  registration_url?: string;
}

export const PROGRAMS: Program[] = [
  // ───────────────────────────────────────────────────────────────
  {
    slug: 'clinical-psychotherapy',
    title: 'Clinical Psychotherapy',
    hours: 200,
    duration: '1 year',
    format: 'hybrid',
    level: 'advanced',
    summary:
      'Flagship IPAS program covering the full arc of clinical psychotherapy — theory, technique, supervision, ethics. Graduates receive an IPAS Certificate of Achievement signed by the President of the Council.',
    description: [
      'Clinical Psychotherapy is the flagship annual programme of the International Psychotherapy Association (IPAS). It is designed for clinicians who already hold a core qualification in psychology, medicine, counselling or social work and who wish to deepen their understanding of the psychodynamic tradition while building a reliable, reproducible clinical technique. The curriculum has been shaped by two decades of graduate training practice in Europe and North America, and further refined through the Council of IPAS in consultation with senior supervisors working in both public and private sectors.',
      'The programme follows the arc of an actual treatment. We begin with the first telephone contact, the setting of the frame, the preparatory interview and the working agreement; we move on to the middle phase where transference, counter-transference and resistance become the real material of the work; and we end with the often neglected but decisive phase of termination. At every step theory is grounded in casework. Participants bring their own clinical material to supervision, and each cohort observes a series of video-recorded sessions that illustrate the concepts under discussion.',
      'The theoretical backbone is drawn from the object relations tradition — Fairbairn, Winnicott, Bion, Klein, Ogden — but we also give serious attention to attachment theory, mentalisation-based treatment, and contemporary neuroscience of affect regulation. The aim is not encyclopaedic coverage of schools but the construction of a coherent internal map that the clinician can actually use under the pressure of clinical encounter. Ethics and professional conduct are not treated as a separate module added at the end; they are woven through every unit, because clinical judgement and ethical judgement are in practice inseparable.',
      'Teaching is delivered in a hybrid format. Core didactic units are pre-recorded and available asynchronously, so that participants in different time zones can study at their own pace. Case seminars and supervision groups are conducted live by video-conference in groups of no more than eight, ensuring that each participant presents clinical material several times during the year. Two three-day residentials — one near the start of the programme, one near the end — provide the experiential and collegial anchor of the training.',
      'Assessment is continuous and formative. Participants submit written case formulations, process notes and reflective journals; they receive detailed written feedback from supervisors; and in the final third of the programme they present an extended case study to the cohort. Certification is contingent on attendance, supervision engagement, and the quality of the final case presentation. Graduates receive the IPAS Certificate of Achievement in Clinical Psychotherapy, signed by Robin Mackay, President of the Council, and bearing a unique verification identifier accessible at intpas.com.',
    ],
    topics: [
      'Psychodynamic and object relations theory',
      'The therapeutic frame and working alliance',
      'Transference, counter-transference and resistance',
      'Case formulation and treatment planning',
      'Ethics, boundaries and professional conduct',
      'Termination and long-term outcome',
    ],
    audience:
      'Psychologists, psychiatrists, counsellors and social workers with an existing clinical caseload who wish to deepen their psychodynamic practice and obtain an internationally verifiable qualification.',
    outcomes: [
      'Conduct a psychodynamically-informed initial assessment',
      'Write a coherent case formulation rooted in object relations theory',
      'Recognise and work with transference and counter-transference material',
      'Manage the frame and common ruptures of the therapeutic alliance',
      'Handle termination ethically and therapeutically',
    ],
    modules: [
      { title: 'Module 1 — Foundations & Frame', items: ['History of psychodynamic thought', 'Setting the frame', 'Initial assessment and indication'] },
      { title: 'Module 2 — The Middle Phase', items: ['Transference dynamics', 'Counter-transference as data', 'Working with resistance and impasse'] },
      { title: 'Module 3 — Specific Clinical Situations', items: ['Depression and loss', 'Anxiety and trauma', 'Personality organisation'] },
      { title: 'Module 4 — Ethics & Termination', items: ['Boundary management', 'Record-keeping and confidentiality', 'Therapeutic termination'] },
    ],
    hosted_by: 'ipas',
    registration_url: '/membership',
  },

  // ───────────────────────────────────────────────────────────────
  {
    slug: 'clinical-psychology-and-psychotherapy',
    title: 'Clinical Psychology & Psychotherapy',
    hours: 200,
    duration: '1 year',
    format: 'hybrid',
    level: 'advanced',
    summary:
      'Integrated programme combining academic clinical psychology with practical psychotherapy skills. Suitable for recent graduates starting clinical careers.',
    description: [
      'Clinical Psychology & Psychotherapy is a one-year integrated programme that bridges two domains which are often taught separately: the rigorous, assessment-based world of clinical psychology and the craft of psychotherapy itself. It addresses a problem that early-career clinicians repeatedly describe — the gap between what they learned at university about psychopathology and the moment when they find themselves alone in a room with a patient who does not fit any textbook category.',
      'The programme does not take sides in the long-running debate between evidence-based structured treatments and open-ended dynamic work. Instead it treats these traditions as complementary instruments. A clinician trained only in protocols misses the relational texture that drives engagement and drop-out; a clinician trained only in depth work may overlook validated interventions that save years of suffering. The IPAS position — developed over years of teaching and supervision — is that a modern clinical psychologist should be fluent in both.',
      'The syllabus opens with three months of rigorous psychopathology grounded in ICD-11 and DSM-5-TR, with particular attention to mood disorders, anxiety spectrum, trauma-related conditions, personality organisation and psychotic phenomena. We pay careful attention to cultural presentation: the same underlying difficulty can look very different in Azerbaijan, in Germany, or in the United States. Assessment methods include the semi-structured clinical interview, the mental state examination, and the appropriate use of standardised instruments such as the PHQ-9, GAD-7, PCL-5 and PID-5-BF.',
      'From month four onwards the programme pivots to treatment. Short-term structured work (cognitive-behavioural therapy for anxiety and depression, prolonged exposure for PTSD) is taught alongside long-term psychodynamic therapy, and participants are asked to formulate a single case from both perspectives. This exercise reliably produces one of the most valuable learning experiences of the year: students see concretely where the two traditions converge and where they offer genuinely different leverage on the same clinical problem.',
      'Supervision groups meet weekly throughout the year. Each group of six to eight participants is led by a senior clinician who has been appointed by the Council. Cases are presented in rotation, with written formulations circulated in advance. The supervisor offers both protocol-level and formulation-level commentary, and the group is encouraged to debate respectfully. A written final case study, approximately six thousand words, integrating assessment, formulation and treatment course, is submitted in month eleven and forms the principal basis for certification.',
      'Graduates receive the IPAS Certificate in Clinical Psychology & Psychotherapy, signed by the President of the Council. The certificate is widely recognised by regulatory bodies that accept post-qualification clinical training, and it is verifiable at intpas.com.',
    ],
    topics: [
      'Psychopathology (ICD-11 / DSM-5-TR)',
      'Structured clinical assessment and psychometrics',
      'Short-term protocol-based psychotherapy',
      'Long-term psychodynamic psychotherapy',
      'Integrated case formulation',
      'Cultural and contextual factors in diagnosis',
    ],
    audience:
      'Recent graduates of clinical psychology, psychiatry trainees and early-career mental health professionals who wish to consolidate foundational clinical skills across both structured and dynamic traditions.',
    outcomes: [
      'Perform a comprehensive clinical assessment and mental state examination',
      'Select and administer standardised instruments appropriately',
      'Deliver evidence-based short-term treatments for common disorders',
      'Formulate and conduct longer-term psychodynamic work',
      'Integrate diagnostic, formulation-based and protocol-based thinking',
    ],
    modules: [
      { title: 'Module 1 — Psychopathology & Assessment', items: ['ICD-11 / DSM-5-TR', 'The clinical interview', 'Psychometric instruments'] },
      { title: 'Module 2 — Short-Term Evidence-Based Treatments', items: ['CBT for anxiety and depression', 'Prolonged exposure for PTSD', 'Behavioural activation'] },
      { title: 'Module 3 — Long-Term Psychodynamic Work', items: ['Transference-based treatment', 'Mentalisation-based approaches', 'Working with personality organisation'] },
      { title: 'Module 4 — Integration & Final Case', items: ['Integrative formulation', 'Treatment planning across traditions', 'Final extended case study'] },
    ],
    hosted_by: 'ipas',
  },

  // ───────────────────────────────────────────────────────────────
  {
    slug: 'child-psychology',
    title: 'Child Psychology',
    hours: 36,
    duration: '9 weeks',
    format: 'online',
    level: 'foundational',
    summary:
      'Introduction to the psychological development of children from infancy to early adolescence, with focus on attachment, emotional regulation and family dynamics.',
    description: [
      'Child Psychology is a nine-week foundational programme designed for practitioners who encounter children in their professional life — teachers, school counsellors, paediatric nurses, social workers, early-career psychologists — but who have not had the opportunity to study developmental psychology in depth. It is also a natural starting point for those who later intend to proceed to our Clinical Child & Adolescent Psychology specialist programme.',
      'The programme takes seriously the observation, repeated across research traditions from Bowlby to Fonagy, that children do not simply express adult psychopathology in miniature. Their symptoms have a developmental grammar; a fear or a withdrawal means something different at three, at seven and at eleven. A practitioner who does not understand the expected milestones cannot distinguish a transient difficulty from a worrying deviation.',
      'The curriculum begins in infancy, with the formation of the attachment bond, the role of primary caregiving, and the earliest foundations of affect regulation. We draw on classic attachment research — Ainsworth, Main, Sroufe — and on the contemporary neuro-affective literature. From there we move through the pre-school years (the rise of symbolic play and theory of mind), the early school years (peer relations, self-concept, the transition to formal learning) and early adolescence (identity, puberty, the renegotiation of the parental relationship).',
      'Each week combines a ninety-minute pre-recorded lecture, a required reading package of approximately forty pages, and a live seventy-five-minute discussion seminar by video-conference. Participants are encouraged to bring observational material from their own professional settings — a classroom, a family case, a clinical interview — and to discuss it in the group. Confidentiality protocols are taught in week one and adhered to throughout.',
      'Assessment consists of weekly reflective posts on the learning platform and a final four-thousand-word developmental profile of a single child (anonymised, with supervisor approval). The profile integrates attachment history, cognitive milestones, emotional regulation, peer relations and family context. Graduates receive the IPAS Certificate in Child Psychology (Foundational), signed by the President of the Council.',
    ],
    topics: [
      'Stages of cognitive and emotional development',
      'Attachment theory and caregiving',
      'Play and symbolic thinking',
      'Common childhood difficulties',
      'Family and school context',
    ],
    audience: 'Teachers, counsellors, social workers, paediatric nurses and early-career psychologists.',
    outcomes: [
      'Describe typical milestones from infancy to early adolescence',
      'Apply attachment-informed understanding to child behaviour',
      'Distinguish transient difficulties from clinically relevant signs',
      'Produce a developmentally-informed child profile',
    ],
    hosted_by: 'ipas',
  },

  // ───────────────────────────────────────────────────────────────
  {
    slug: 'clinical-child-and-adolescent-psychology',
    title: 'Clinical Child & Adolescent Psychology',
    hours: 42,
    duration: '11 weeks',
    format: 'online',
    level: 'specialist',
    summary:
      'Advanced clinical skills for working with children and adolescents, including assessment, play-based therapy and family work.',
    description: [
      'Clinical Child & Adolescent Psychology is an eleven-week specialist programme that builds directly on the foundational Child Psychology course or equivalent prior study. It is intended for practitioners who are, or who will shortly be, carrying a clinical caseload of children, adolescents and their families. The programme combines contemporary developmental psychopathology with practical skills in assessment, play-based work and family engagement.',
      'A central premise of the training is that clinical work with young people is never dyadic. Every child is embedded in a family, a school and a wider cultural matrix, and the clinician who overlooks any of these quickly loses purchase on the case. The programme therefore devotes substantial time to the first encounter with parents, the contract with the family, the liaison with schools and other services, and the ethical complexities of confidentiality when the patient is a minor.',
      'Assessment of children requires a different skill set from adult assessment. Children are often referred by adults for behaviours the adults find difficult; the task of the clinician is to translate the presenting complaint into a developmentally-informed formulation. We teach the semi-structured child interview, the adapted mental state examination, standard screening instruments (SDQ, CBCL, RCADS, CDI-2), the use of drawing and play as assessment tools, and the systemic interview with parents. Particular attention is given to neurodevelopmental conditions — autism spectrum, ADHD, specific learning difficulties — because misidentification of these at initial assessment is a common source of later therapeutic failure.',
      'The treatment component draws on several well-established traditions. Play therapy, in both non-directive (Axline, Landreth) and psychodynamic (Anna Freud, Winnicott) versions, is taught as the lingua franca of work with younger children. Cognitive-behavioural approaches adapted for adolescents are covered for anxiety, depression and post-traumatic presentations. Family-based interventions — both structural and narrative — are included because many childhood presentations remit most reliably when the family context is addressed.',
      'Participants present case material weekly in small supervision groups. Each participant submits at least two detailed process notes during the programme and a final case study of approximately five thousand words. The certificate is awarded on the basis of attendance, active supervision engagement and the quality of the final case study. The IPAS Certificate in Clinical Child & Adolescent Psychology is signed by the President of the Council and bears a unique verification identifier.',
    ],
    topics: [
      'Clinical interview with children and adolescents',
      'Play-based and expressive therapies',
      'Adapted CBT for young people',
      'Family systems and family-based interventions',
      'Neurodevelopmental conditions',
      'Ethics and confidentiality with minors',
    ],
    audience: 'Qualified clinicians taking on a caseload of children, adolescents and their families.',
    outcomes: [
      'Conduct a developmentally-informed clinical interview',
      'Administer and interpret standard child/adolescent instruments',
      'Deliver structured treatments adapted for young people',
      'Engage families as partners in treatment',
      'Navigate the ethical terrain of work with minors',
    ],
    hosted_by: 'ipas',
  },

  // ───────────────────────────────────────────────────────────────
  {
    slug: 'cognitive-behavioural-therapy',
    title: 'Cognitive Behavioural Therapy (CBT)',
    hours: 36,
    duration: '9 weeks',
    format: 'online',
    level: 'foundational',
    summary:
      'Evidence-based CBT foundation covering depression, anxiety, panic and trauma protocols. Prepares clinicians for structured short-term work.',
    description: [
      'Cognitive Behavioural Therapy is the most thoroughly researched form of psychotherapy and a required component of contemporary clinical competence. Our nine-week foundational programme is aimed at clinicians who need to deliver reliable, structured treatment for common mental health conditions and who want their practice rooted in the contemporary research base rather than in outdated first-generation models.',
      'The course is built around the unified cognitive model — the idea that thoughts, affect, physiology and behaviour interact in predictable loops, and that clinical change can be engineered by intervening systematically at each point in the loop. Participants learn to construct a clear case conceptualisation, to negotiate a treatment agreement, to deliver the core interventions (behavioural activation, cognitive restructuring, behavioural experiments, graded exposure) and to adjust the protocol when progress stalls.',
      'Three disorder-specific modules form the heart of the programme: depression, anxiety disorders (including panic and social anxiety), and post-traumatic stress. Each module combines didactic teaching with demonstration videos and role-play practice. Particular attention is paid to the mistakes most commonly made by early-career therapists — premature challenge of cognitions before a working alliance has been established; exposure that is too cautious to produce habituation; failure to target safety behaviours that maintain the disorder.',
      'The programme follows the structure of real clinical work. Week one establishes the therapeutic relationship and the contract. Weeks two and three teach behavioural activation and the cognitive model. Weeks four through six cover protocol-based treatment for depression, anxiety and trauma. Weeks seven and eight address relapse prevention and working with residual symptoms. Week nine is devoted to supervision and to presentation of a completed case.',
      'Assessment is practical. Participants submit a full case conceptualisation in week four, a process note in week six, and a final completed-case presentation (video extract plus written commentary) in week nine. The IPAS Certificate in Cognitive Behavioural Therapy is awarded on successful completion and is signed by the President of the Council.',
    ],
    topics: [
      'The cognitive model and case conceptualisation',
      'Behavioural activation and behavioural experiments',
      'Cognitive restructuring',
      'Exposure for anxiety disorders',
      'Protocols for depression, panic and PTSD',
      'Relapse prevention',
    ],
    audience: 'Clinicians who wish to deliver structured short-term treatment for common mental health conditions.',
    outcomes: [
      'Produce a CBT case conceptualisation',
      'Negotiate a collaborative treatment plan',
      'Deliver validated protocols for depression, anxiety and PTSD',
      'Identify and modify maintaining safety behaviours',
      'Plan and deliver a relapse-prevention phase',
    ],
    hosted_by: 'ipas',
  },

  // ───────────────────────────────────────────────────────────────
  {
    slug: 'applied-behavior-analysis',
    title: 'Applied Behavior Analysis (ABA) Therapy',
    hours: 42,
    duration: '11 weeks',
    format: 'online',
    level: 'specialist',
    summary:
      'Principles and practice of ABA for autism spectrum and developmental conditions — assessment, intervention design, data-driven adjustment.',
    description: [
      'Applied Behaviour Analysis is the most extensively validated approach for skill acquisition and behaviour change in autism spectrum condition, other neurodevelopmental presentations and learning disability. Our eleven-week specialist programme offers a clinically grounded introduction to ABA, covering both the foundational science of behaviour and the practical, ethical delivery of interventions in clinics, schools and home settings.',
      'The programme begins with the conceptual foundations: operant and respondent conditioning, the three-term contingency, reinforcement schedules, and the crucial distinction between behaviour and its function. Participants are introduced to the literature of functional analysis — how to identify why a behaviour occurs rather than merely what it looks like — because this distinction turns out to be decisive for intervention design. Every subsequent clinical module returns to functional analysis as its organising principle.',
      'Assessment is covered in depth. Participants learn to use direct observation, ABC recording, structured preference assessments and standardised instruments such as the VB-MAPP and the ABLLS-R. We give careful attention to the construction of the skills-acquisition plan: selecting target behaviours, operationalising them, choosing reinforcers, designing prompting and prompt-fading procedures, and collecting data that actually inform clinical decisions rather than merely generate paperwork.',
      'Intervention modules cover verbal behaviour and communication training, social skills, daily living skills, and the management of challenging behaviour. We treat the ethics of ABA practice with particular seriousness: the programme addresses historical critiques from the autistic community, the contemporary shift towards assent-based and trauma-informed practice, and the clinician\'s responsibility to ensure that interventions are genuinely in the service of the learner and not merely of the surrounding adults.',
      'The programme concludes with a supervised practicum element. Participants submit video-recorded sessions (with appropriate consent) for supervision, a complete skills-acquisition programme for a single learner, and a final integrative case report. The IPAS Certificate in Applied Behaviour Analysis is awarded on successful completion.',
    ],
    topics: [
      'Operant and respondent conditioning',
      'Functional analysis of behaviour',
      'Skills-acquisition programming',
      'Verbal behaviour and communication',
      'Management of challenging behaviour',
      'Ethics of contemporary ABA practice',
    ],
    audience: 'Clinicians, educators and therapists working with autism spectrum and developmental conditions.',
    outcomes: [
      'Conduct a functional assessment',
      'Design a data-driven skills-acquisition programme',
      'Deliver reinforcement, prompting and fading procedures correctly',
      'Apply ethical, assent-based practice',
    ],
    hosted_by: 'ipas',
  },

  // ───────────────────────────────────────────────────────────────
  {
    slug: 'couples-counselling-in-family-therapy',
    title: 'Couples Counselling in Family Therapy',
    hours: 36,
    duration: '9 weeks',
    format: 'online',
    level: 'specialist',
    summary:
      'Couples-focused track within the family therapy tradition — working with conflict, repair and attachment injuries.',
    description: [
      'Couples Counselling in Family Therapy is a nine-week specialist programme addressing the distinctive clinical situation of working with a dyad in the room. Couple work is technically one of the most demanding forms of clinical practice: the therapist is required to track three emotional realities simultaneously (hers, his and the couple\'s shared unconscious life) and to maintain multi-partiality when each partner actively solicits alliance.',
      'The programme draws on three complementary traditions. From the structural-systemic tradition we take the attention to patterns, rules and boundaries in the couple system. From Emotionally Focused Therapy (Greenberg, Johnson) we take the attachment-based formulation of negative cycles and the sequence of de-escalation, restructuring and consolidation. From the psychoanalytic couple tradition (Teruel, Ruszczynski, Morgan) we take the concept of the shared couple unconscious, the use of projective identification as a unit of observation, and the three-person dynamics that erupt around affairs and triangulation.',
      'The early weeks of the programme address assessment: the joint interview, individual interviews, the elicitation of relationship history, the identification of the negative cycle, and the contracting process. Special attention is paid to high-conflict couples, the assessment of violence and control (with clear safeguarding protocols), and the ethical complications of working with couples where one or both partners have undisclosed affairs.',
      'The treatment modules cover de-escalation of conflict, repair of attachment injuries, work with impasse, and the particular clinical challenges of affairs, stepfamily dynamics and long-standing emotional withdrawal. Each module combines didactic teaching, demonstration footage and supervised role-play. Participants bring case material to the weekly supervision group from week three onwards.',
      'Assessment is through weekly reflective contributions, a mid-programme written formulation of a couple, and a final case presentation combining video extract and written commentary. The IPAS Certificate in Couples Counselling is signed by the President of the Council and is verifiable online.',
    ],
    topics: [
      'Systemic and attachment models of couple functioning',
      'Joint and individual assessment',
      'De-escalation of negative cycles',
      'Repair of attachment injuries',
      'Affairs and three-person dynamics',
    ],
    audience: 'Qualified clinicians taking on couple casework.',
    outcomes: [
      'Conduct an integrated couple assessment',
      'Identify and name the negative cycle',
      'Facilitate structured conversations that de-escalate conflict',
      'Work therapeutically with affairs and attachment injuries',
    ],
    hosted_by: 'ipas',
  },

  // ─── Расширенные программы (content base: IPI) ─────────────────
  {
    slug: 'object-relations-theory-and-practice',
    title: 'Object Relations Theory & Practice',
    duration: 'Two years',
    format: 'in-person',
    level: 'advanced',
    summary:
      'Two-year immersion in object relations theory and its application in consulting rooms. Explores Fairbairn, Klein, Winnicott and Fonagy in depth.',
    description: [
      'Object Relations Theory & Practice is a two-year advanced programme that represents the deepest theoretical and clinical training IPAS offers in the psychoanalytic tradition. It is intended for experienced clinicians who already have a working familiarity with psychodynamic ideas and who now wish to undertake a serious, sustained engagement with the British object relations school and its contemporary developments.',
      'The object relations tradition is arguably the most clinically productive current within post-Freudian thought. Beginning with Fairbairn\'s radical reformulation that the human being is object-seeking rather than pleasure-seeking, it has given clinicians some of their most powerful tools: Klein\'s paranoid-schizoid and depressive positions, Winnicott\'s transitional space and the capacity to be alone, Bion\'s container-contained and alpha-function, Fonagy\'s mentalisation. These are not historical artefacts but working instruments that shape every session a psychodynamic clinician conducts.',
      'The first year of the programme is theoretical. We read the primary texts — Fairbairn, Klein, Winnicott, Bion — in chronological sequence, with accompanying secondary literature that situates each author in the debates of his or her time. We also read across into contemporary infant research (Stern, Tronick) and the mentalisation literature (Fonagy, Bateman), because the theoretical framework has to be tested against empirical data about early development.',
      'The second year is clinical. Participants present cases in small supervision groups led by senior Council-appointed supervisors, and each case is formulated explicitly in object-relational terms. We focus on the recognition and management of projective identification, the use of countertransference as a primary data source, the handling of primitive defences, and the working through of the depressive position in the consulting room. Particular attention is given to the treatment of borderline and narcissistic personality organisations, for which object relations theory provides uniquely sophisticated technique.',
      'The programme is delivered in-person at residential weekends complemented by weekly online supervision. Participants are expected to be in personal analysis or psychotherapy during the programme (or to have been recently). The IPAS Certificate in Object Relations Theory & Practice is awarded to participants who complete both years, maintain attendance, engage actively in supervision, and submit an acceptable extended case study of approximately ten thousand words.',
    ],
    topics: [
      'Fairbairn\'s endopsychic structure',
      'Klein\'s paranoid-schizoid and depressive positions',
      'Winnicott on transitional phenomena and holding',
      'Bion on container-contained and alpha-function',
      'Projective identification and primitive defences',
      'Clinical technique informed by object relations',
    ],
    audience: 'Experienced clinicians seeking deep psychoanalytic training.',
    outcomes: [
      'Read primary object-relational texts critically',
      'Formulate clinical material in object-relational terms',
      'Recognise and work with projective identification',
      'Treat patients with personality organisation difficulties',
    ],
    hosted_by: 'ipas',
    source: { name: 'IPI', url: 'https://theipi.org/clinical-training/object-relations-theory-and-practice/' },
  },

  // ───────────────────────────────────────────────────────────────
  {
    slug: 'psychoanalytic-couple-therapy',
    title: 'Psychoanalytic Couple Therapy',
    format: 'in-person',
    level: 'advanced',
    summary:
      'Advanced training in couple and family treatment for graduates of Object Relations programmes.',
    description: [
      'Psychoanalytic Couple Therapy is an advanced programme for clinicians who have completed object relations training or equivalent psychodynamic foundation, and who wish to develop specialist expertise in the psychoanalytic treatment of couples and families. It draws on the influential British tradition of the Tavistock Couple Relationships service and on the North American developments of the International Psychotherapy Institute tradition.',
      'Couple therapy, in the psychoanalytic tradition, takes as its central object not the individuals but the unconscious shared life of the couple — the organised, often defensive way in which two separate internal worlds have interlocked to create a jointly authored relational pattern. This shared unconscious life is not the sum of two individual psychologies; it is an emergent third, with its own history, its own defences, its own resistances and its own possibilities for growth.',
      'The programme addresses the distinctive technical demands of this form of work: maintaining analytic neutrality with two patients who are actively pulling for alliance; recognising and naming the couple\'s projective system as it unfolds live in the room; interpreting at the level of the couple rather than the individual; holding the analytic frame when each partner offers reasons to break it.',
      'Particular emphasis is placed on the clinical management of three common and difficult situations: the affair, which restructures the couple\'s unconscious geometry and demands careful handling of secrets and disclosures; the impasse, in which the couple has stabilised at a level of dysfunction that neither partner can unilaterally shift; and the transition to three-person dynamics — the arrival of children, the involvement of extended family, the emergence of rivalry and exclusion.',
      'Teaching combines theoretical seminars on the primary literature (Teruel, Ruszczynski, Morgan, Ludlam, Clulow) with live supervision of clinical material. Participants present a couple case in each seminar of the second half of the programme, and submit a final case study of approximately eight thousand words. The IPAS Certificate in Psychoanalytic Couple Therapy is awarded on successful completion.',
    ],
    topics: [
      'The couple\'s shared unconscious',
      'Marital projective identification',
      'Three-person dynamics and triangulation',
      'Working with affairs and impasse',
      'Long-term psychoanalytic couple treatment',
    ],
    audience: 'Clinicians with prior object relations training.',
    outcomes: [
      'Formulate cases at the level of the couple',
      'Interpret the shared unconscious material',
      'Manage neutrality and the frame in couple work',
      'Work with affairs, impasse and triangulation',
    ],
    hosted_by: 'ipas',
    source: { name: 'IPI', url: 'https://theipi.org/clinical-training/psychoanalytic-couple-therapy/' },
  },

  // ───────────────────────────────────────────────────────────────
  {
    slug: 'infant-observation',
    title: 'Infant Observation',
    format: 'in-person',
    level: 'foundational',
    summary:
      'Focused study of early child development — primary relationships, primitive anxieties and defences — and how such learning informs clinical technique.',
    description: [
      'Infant Observation, in the form developed at the Tavistock Clinic by Esther Bick in the 1940s and refined in subsequent decades, is one of the most effective experiential educations available to a clinician. It is not an academic exercise in developmental psychology; it is a disciplined, weekly encounter with the emotional life of a baby in the presence of its primary caregiver, over a sustained period of time, and with a small seminar group in which the raw experience is discussed and thought about.',
      'Each participant in the programme makes a weekly one-hour observation of the same baby, in the same family, from early infancy through the second birthday. The observer takes no notes during the observation; detailed written observations are produced from memory afterwards and presented to the seminar in rotation. The role of the observer is to pay attention, to resist the urge to help or to interpret, and to become a disciplined receiver of the full emotional atmosphere of mother-and-baby life.',
      'What participants encounter, often with considerable surprise, is the sheer intensity of primitive emotional states — the annihilation anxieties that Melanie Klein and Wilfred Bion described, the primitive defences against unbearable experience, the delicate work of the containing parent, the moments when containment fails and what happens then. The observer lives through these experiences not as a theoretical matter but as an immediate emotional reality, and the seminar group becomes an indispensable container for what would otherwise be overwhelming material.',
      'The clinical payoff is substantial. Participants report that they recognise in adult patients the same primitive states they met for the first time in the infant observation; that they become more tolerant of silence, confusion and not-knowing in their own clinical work; and that they develop a vocabulary for affective experience that they did not previously have. The programme is widely considered an ideal preparation for any long-term psychoanalytic training.',
      'The programme runs for two years. Seminars are held in person weekly, in groups of four to six, led by an experienced Council-appointed seminar leader. Participants submit an extended observational account at the end of each year. The IPAS Certificate in Infant Observation is awarded on completion.',
    ],
    topics: [
      'The Tavistock method of infant observation',
      'Primitive emotional states and defences',
      'The containing function of the parent',
      'The role of the observer',
      'Clinical implications for adult work',
    ],
    audience: 'Clinicians preparing for or undertaking long-term psychoanalytic training.',
    outcomes: [
      'Conduct disciplined, non-intrusive observation',
      'Produce detailed observational accounts',
      'Recognise primitive emotional states clinically',
      'Make use of the seminar group as a thinking space',
    ],
    hosted_by: 'ipas',
    source: { name: 'IPI', url: 'https://theipi.org/clinical-training/infant-observation/' },
  },

  // ───────────────────────────────────────────────────────────────
  {
    slug: 'psychoanalytic-psychotherapy-consultation',
    title: 'Psychoanalytic Psychotherapy Consultation Program',
    format: 'online',
    level: 'continuing',
    summary:
      'Online course honing consultation and supervision skills of experienced psychoanalytic clinicians.',
    description: [
      'The Psychoanalytic Psychotherapy Consultation Program is a continuing-education course for experienced psychoanalytic clinicians who are developing the skills required to provide consultation and supervision to colleagues. It is widely recognised that being a good clinician does not automatically make one a good supervisor; the supervisory situation requires its own theory and its own craft, and these are what the programme teaches.',
      'The programme opens with the question of what supervision actually is: how it differs from therapy (which it is not), from teaching (which it partly is), and from consultation to organisations (which it sometimes becomes). We work with the classical contributions on the topic — Ekstein and Wallerstein, Langs, Casement, and the more recent relational literature — and develop a working framework that participants can apply in their own supervisory work.',
      'A central theme is parallel process: the way in which the dynamics of the patient-therapist relationship are often unconsciously re-enacted in the therapist-supervisor relationship. Learning to recognise parallel process and to make productive use of it is one of the core supervisory skills the programme teaches. We also address the ethical dimensions of supervision — the boundaries of confidentiality within the supervisory triad, the supervisor\'s gatekeeping function, and the handling of situations where supervision reveals clinical practice that raises serious concerns.',
      'Participants present their own supervisees\' clinical material (with appropriate consent) to small peer-consultation groups led by senior supervisors. The exercise is deliberately constructed as a second-order supervision: the primary clinician supervises a patient, the participant supervises the primary clinician, and the seminar examines the supervisory process itself. This is technically demanding and intellectually alive work.',
      'The programme is delivered online over an academic year, with weekly seminar meetings. The IPAS Certificate in Psychoanalytic Psychotherapy Consultation is awarded on successful completion.',
    ],
    topics: ['The supervisory frame', 'Parallel process', 'Ethics of supervision', 'Gatekeeping and competence'],
    audience: 'Experienced psychoanalytic clinicians taking on supervisory roles.',
    outcomes: [
      'Establish a clear supervisory contract and frame',
      'Recognise and work with parallel process',
      'Navigate ethical complexities of supervision',
      'Provide structured feedback to supervisees',
    ],
    hosted_by: 'ipas',
    source: { name: 'IPI', url: 'https://theipi.org/clinical-training/clinical-consultants-in-psychotherapy/' },
  },

  // ───────────────────────────────────────────────────────────────
  {
    slug: 'master-speaker-series',
    title: 'Master Speaker Series',
    format: 'videoconference',
    level: 'continuing',
    summary:
      'Monthly videoconference series with internationally known speakers on contemporary topics in psychoanalysis and psychotherapy.',
    description: [
      'The Master Speaker Series is a continuing-education offering designed to keep practising clinicians in living contact with the leading edge of psychoanalytic and psychotherapeutic thought. Each month, an internationally known speaker presents a ninety-minute lecture followed by a forty-five-minute live discussion, open to participants around the world by video-conference.',
      'The series is carefully curated. The Council selects speakers whose work represents either established excellence in the field — major figures whose contributions have shaped contemporary practice — or significant emerging directions that thoughtful clinicians should know about. Recent and forthcoming seasons have included speakers on complex trauma, the psychoanalytic understanding of social processes, work with psychotic states, contemporary developments in mentalisation-based treatment, and clinical questions arising from the integration of neuroscience with depth psychology.',
      'Each session is structured for adult professional learning. Speakers send pre-reading at least two weeks in advance, giving participants the opportunity to prepare seriously. The lecture itself is substantive — the format is deliberately not a brief talk followed by questions, but a full professional presentation with the depth and density such learning requires. The live discussion that follows is genuinely two-way, with speakers engaging with clinical material and theoretical challenges raised from the floor.',
      'The series is particularly valuable for clinicians who completed their core training some years ago and who are aware that the field has moved on. It is also used by early-career clinicians as a continuing exposure to the texture and vocabulary of senior professional thought. Many participants subscribe for multiple years, treating the series as a standing commitment to professional development.',
      'All sessions are recorded and remain available to participants for the duration of the season. Continuing-education credits are issued for each attended session. The IPAS Certificate of Continuing Education is issued annually to participants who attend the majority of sessions.',
    ],
    topics: ['Rotating themes', 'Live Q&A with presenters', 'Continuing-education credits'],
    audience: 'Practising clinicians committed to ongoing professional development.',
    outcomes: [
      'Stay current with contemporary clinical thought',
      'Engage with senior international clinicians',
      'Accumulate continuing-education credits',
    ],
    hosted_by: 'ipas',
    source: { name: 'IPI', url: 'https://theipi.org/clinical-training/2025-2026-master-speaker-series/' },
  },
];
