/*
参考
https://en.wikipedia.org/wiki/ARPABET*/
/*
ARPABET	IPA	Example(s)
1-letter2-letter   修正 （美| 英）    音标                          ARPAbet
a	AA	    ɑ	balm,       AA   ɑ | ɒ ɑ:   英 [bɑ:m]     美 [bɑm]        B AA1 M
bot                         英 [bɒt]      美 [bɑt]        B AA1 T
@	AE	    æ	bat         AE   æ          英 [bæt]      美 [bæt]        B AE1 T
A	AH	    ʌ	butt        AH   ʌ          英 [bʌt]      美 [bʌt]        B AH1 T
c	AO	    ɔ	bought      AO   ɔ | ɔ:     英 [bɔ:t]     美 [bɔt]        B AO1 T
W	AW	    aʊ	bout        AW   aʊ         英 [baʊt]     美 [baʊt]       B AW1 T
x	AX	    ə	about       AX   ə          英 [əˈbaʊt]   美 [əˈbaʊt]     AH0 B AW1 T
N/A	AXR[4]	ɚ   letter      ER   ɚ          英 [ˈletə(r)] 美 [ˈlɛtɚ]      L EH1 T ER0
Y	AY	    aɪ	bite        AY   aɪ         英 [baɪt]     美 [baɪt]       B AY1 T
E	EH	    ɛ	bet         EH   ɛ | e      英 [bet]      美 [bet]        B EH1 T
R	ER	    ɝ	bird        ER   ɜr | ɜ:    英 [bɜ:d]     美 [bɜrd]       B ER1 D
e	EY	    eɪ	bait        EY   eɪ         英 [beɪt]     美 [beɪt]       B EH1 T
I	IH	    ɪ	bit         IH   ɪ          英 [bɪt]      美 [bɪt         B IH1 T
X	IX	    ɨ	roses       IX   ɨ          英 ['rəʊzɪz]  美 ['roʊzɪz]    R OW1 Z
rabbit                      英 [ˈræbɪt]   美 [ˈræbɪt]     R AE1 B AH0 T
i	IY	    i	beat        IY   i | i:     英 [bi:t]     美 [bit]        B IY1 T
o	OW	    oʊ	boat        OW   oʊ | əʊ    英 [bəʊt]     美 [boʊt]       B OW1 T
O	OY	    ɔɪ	boy         OY   ɔɪ         英 [bɔɪ]      美 [bɔɪ]        B OY1
U	UH	    ʊ	book        UH   ʊ          英 [bʊk]      美 [bʊk]        B UH1 K
u	UW	    u	boot        UW   u | u:     英 [bu:t]     美 [but]        B UW1 T
N/A	UX[4]	ʉ	dude        UW   ʉ          英 [du:d]     美 [dud, djud]  D UW1 D*/
import { Phoneme } from "./model/phoneme";
export const vowels: Phoneme[] = [
    new Phoneme("AA", "\u0251", "\u0251:", "\u0251", true),
    new Phoneme("AE", "\u00e6", "\u00e6", "\u00e6", true),
    new Phoneme("AH", "\u028c", "\u028c", "\u028c", true),
    new Phoneme("AO", "\u0254", "\u0254:", "\u0254", true),
    new Phoneme("AW", "a\u028a", "a\u028a", "a\u028a", true),
    new Phoneme("AX", "\u0259", "\u0259", "\u0259", true),
    new Phoneme("ER", "\u025a", "\u0259r", "\u0259r", true),
    new Phoneme("AY", "a\u026a", "a\u026a", "a\u026a", true),
    new Phoneme("EH", "\u025b", "e", "e", true),
    new Phoneme("ER", "\u025d", "\u025c:", "\u025cr", true),
    new Phoneme("EY", "e", "e\u026a", "e\u026a", true),
    new Phoneme("IH", "\u026a", "\u026a", "\u026a", true),
    new Phoneme("IX", "\u0268", "\u0268", "\u0268", true),
    new Phoneme("IY", "i", "i:", "i:", true),
    new Phoneme("OW", "o", "\u0259\u028a", "o\u028a", true),
    new Phoneme("OY", "\u0254\u026a", "\u0254\u026a", "\u0254\u026a", true),
    new Phoneme("UH", "\u028a", "\u028a", "\u028a", true),
    new Phoneme("UW", "u", "u:", "u", true),
    new Phoneme("UX", "\u0289", "\u0289", "\u0289", true),
];
/*
Consonants[3]
ARPABET	        IPA	        Example
1-letter	    2-letter      修正
b	B	        b	    buy          B   b      英 [baɪ]         美 [baɪ]             B AY1
C	CH	        tʃ	    China        CH  tʃ     英 ['tʃaɪnə]     美 [ˈtʃaɪnə]         CH AY1 N AH0
d	D	        d	    die          D   d      英 [daɪ]         美 [daɪ]             D AY1
D	DH	        ð	    thy          DH  ð      英 [ðaɪ]         美 [ðaɪ]             DH AY1
F	DX	        ɾ	    butter       T   t | ɾ  英 [ˈbʌtə(r)]    美 [ˈbʌtɚ]           B AH1 T ER0
L	EL	        l̩	    bottle       L   l      英 [ˈbɒtl]       美 [ˈbɑtl]           B AA1 T AH0 L
M	EM	        m̩	    rhythm       M   m      英 [ˈrɪðəm]      美 [ˈrɪðəm]          R IH1 DH AH0 M
N	EN	        n̩	    button       N   n      英 [ˈbʌtn]       美 [ˈbʌtn]           B AH1 T AH0 N
f	F	        f	    fight        F   f      英 [faɪt]        美 [faɪt]            F AY1 T
g	G	        ɡ	    guy          G   g      英 [gaɪ]         美 [ɡaɪ]             G AY1
h	HH or H[4]	h	    high         HH  h      英 [haɪ]         美 [haɪ]             HH AY1
J	JH	        dʒ	    jive         JH  dʒ     英 [dʒaɪv]       美 [dʒaɪv]           JH AY1 V
k	K	        k	    kite         K   k      英 [kaɪt]        美 [kaɪt]            K AY1 T
l	L	        l	    lie          L   l      英 [laɪ]         美 [lai]             L AY1
m	M	        m	    my           M   m      英 [maɪ]         美 [maɪ]             M AY1
n	N	        n	    nigh         N   n      英 [naɪ]         美 [naɪ]             N AY1
G	NX or NG[4]	ŋ	    sing         NG  ŋ      英 [sɪŋ]         美 [sɪŋ]             S IH1 NG
N/A	NX[4]	    ɾ̃	    winner                  英 [ˈwɪnə(r)]    美 [ˈwɪnɚ]           W IH1 N ER0
p	P	        p	    pie          P   p      英 [paɪ]         美 [paɪ]             P AY1
Q	Q	        ʔ	    uh-oh        Q   ʔ      英 [ˈʌˈəu]       美 [ˈʌˌo]
r	R	        ɹ	    rye          R   r or ɹ 英 [raɪ]         美 [raɪ]             R AY1
s	S       	s	    sigh         S   s      英 [saɪ]         美 [saɪ]             S AY1
S	SH	        ʃ   	shy          SH  ʃ      英 [ʃaɪ]         美 [ʃaɪ]             SH AY1
t	T	        t	    tie          T   t      英 [taɪ]         美 [taɪ]             T AY1
T	TH	        θ	    thigh        TH  θ      英 [θaɪ]         美 [θaɪ]             TH AY1
v	V	        v      	vie          V   v      英 [vaɪ]         美 [vaɪ]             V AY1
w	W	        w	    wise         W   w      英 [waɪz]        美 [waɪz]            W AY1 Z
H	WH	        ʍ	    why          WH  ʍ      英 [waɪ]         美 [hwaɪ, waɪ]       HH W AY1, W AY1
y	Y	        j	    yachting     Y   j      英 [ˈjɒtɪŋ]      美 [ˈjɑtɪŋ]          Y AA1 T IH0 NG
z	Z	        z	    zoo          Z   z      英 [zu:]         美 [zu]              Z UW1
Z	ZH	        ʒ	    pleasure     ZH  ʒ      英 [ˈpleʒə(r)]   美 [ˈplɛʒɚ]          P L EH1 ZH ER0*/
/*
在英语中，在一个单词的结尾音节中如果无发音的元音字母，或有元音字母也不发音而由l、m或n来充当元音字母，
那么该音节就叫做成音节（syllabic consonant）。在一些英文词典中，常在成音节中的/l/、/m/、/n/下方加上一点（.），写成/l̩/、/n̩/、/m̩/，
用来表示成音节辅音。例如：noodle/'nu:dl̩/、traveler/ˈtrævl̩ɚ/。*/
export const consonants: Phoneme[] = [
    new Phoneme("B", "b", "b", "b", false),
    new Phoneme("CH", "t\u0283", "t\u0283", "t\u0283", false),
    new Phoneme("D", "d", "d", "d", false),
    new Phoneme("DH", "\u00f0", "\u00f0", "\u00f0", false),
    new Phoneme("DX", "\u027e", "\u027e", "\u027e", false),
    new Phoneme("F", "f", "f", "f", false),
    new Phoneme("G", "g", "g", "\u0261", false),
    new Phoneme("HH", "h", "h", "h", false),
    new Phoneme("JH", "d\u0292", "d\u0292", "d\u0292", false),
    new Phoneme("K", "k", "k", "k", false),
    new Phoneme("L", "l", "l", "l", false),
    new Phoneme("M", "m", "m", "m", false),
    new Phoneme("N", "n", "n", "n", false),
    new Phoneme("NG", "\u014b", "\u014b", "\u014b", false),
    new Phoneme("P", "p", "p", "p", false),
    new Phoneme("Q", "\u0294", "\u0294", "\u0294", false),
    new Phoneme("R", "r", "r", "\u0279", false),
    new Phoneme("S", "s", "s", "s", false),
    new Phoneme("SH", "\u0283", "\u0283", "\u0283", false),
    new Phoneme("T", "t", "t", "t", false),
    new Phoneme("TH", "\u03b8", "\u03b8", "\u03b8", false),
    new Phoneme("V", "v", "v", "v", false),
    new Phoneme("W", "w", "w", "w", false),
    new Phoneme("WH", "\u028d", "\u028d", "\u028d", false),
    new Phoneme("Y", "j", "j", "j", false),
    new Phoneme("Z", "z", "z", "z", false),
    new Phoneme("ZH", "\u0292", "\u0292", "\u0292", false),
];
