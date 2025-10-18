import { AnalogyQuestion } from '../types';

interface GPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class GPTService {
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.openai.com/v1/chat/completions'
    : 'http://localhost:5000/api/chat';

  constructor() {
    console.log('GPT Service initialized. Using:', this.baseUrl);
  }

  private async callOpenAI(messages: GPTMessage[]): Promise<string> {
    console.log('Calling OpenAI API with messages:', messages);

    // In production, call OpenAI directly; in development, use backend proxy
    if (process.env.NODE_ENV === 'production') {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      if (!apiKey) {
        console.log('No OpenAI API key found, using mock response');
        throw new Error('No API key available');
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } else {
      // Development: use backend proxy
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend proxy error:', errorData);
        throw new Error(`Backend proxy error: ${response.statusText} - ${errorData.error}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }
  }

  async getTutorResponse(
    userMessage: string, 
    currentQuestion: AnalogyQuestion | null,
    conversationHistory: Array<{role: 'user' | 'assistant', content: string}>
  ): Promise<string> {
    const systemPrompt = `אתה מורה וירטואלי מומחה בפסיכומטרי ובאנלוגיות עבריות. 
    
תפקידך:
1. לעזור לתלמידים לפתור שאלות אנלוגיות
2. להסביר קשרים לוגיים בעברית
3. לתת טיפים וטכניקות לפתרון
4. לעודד ולחזק את התלמיד

כללי התנהגות:
- תמיד ענה בעברית
- השתמש בשפה ברורה ונגישה
- תן הסברים מפורטים אבל לא ארוכים מדי
- אל תגלה את התשובה הנכונה ישירות, אלא הנחה את התלמיד
- השתמש בדוגמאות וטיפים מעשיים
- היה סבלני ומעודד`;

    const contextPrompt = currentQuestion ? `
השאלה הנוכחית:
זוג מקורי: ${currentQuestion.original_pair[0]} : ${currentQuestion.original_pair[1]}
אפשרויות:
1. ${currentQuestion.option_1[0]} : ${currentQuestion.option_1[1]}
2. ${currentQuestion.option_2[0]} : ${currentQuestion.option_2[1]}
3. ${currentQuestion.option_3[0]} : ${currentQuestion.option_3[1]}
4. ${currentQuestion.option_4[0]} : ${currentQuestion.option_4[1]}
רמת קושי: ${currentQuestion.difficulty}
` : '';

    const messages: GPTMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${contextPrompt}\n\nשאלת התלמיד: ${userMessage}` }
    ];

    // Add conversation history
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });

    try {
      return await this.callOpenAI(messages);
    } catch (error) {
      console.error('Error calling GPT-4o:', error);
      
      // Check if it's an API key or network issue
      if (error instanceof Error && error.message.includes('Forbidden')) {
        return 'מצטער, יש בעיה עם מפתח ה-API של OpenAI. אנא בדוק שהמפתח תקין ויש לך הרשאות מתאימות. בינתיים, אני יכול לעזור לך עם שאלות כלליות על אנלוגיות.';
      }
      
      // Fallback to mock response if API fails
      return this.getMockResponse(userMessage, currentQuestion);
    }
  }

  private getMockResponse(userMessage: string, currentQuestion: AnalogyQuestion | null): string {
    const responses = [
      `אני מבין את השאלה שלך. בואו נחשוב על זה יחד:

${currentQuestion ? `
השאלה הנוכחית: ${currentQuestion.original_pair[0]} : ${currentQuestion.original_pair[1]}

כדי לפתור אנלוגיות, עליך לזהות את הקשר הלוגי בין הזוג המקורי. נסה לשאול את עצמך:
1. מה הקשר בין "${currentQuestion.original_pair[0]}" ל"${currentQuestion.original_pair[1]}"?
2. איזה מהאפשרויות מקיימת את אותו הקשר?

האם תרצה שאעזור לך לזהות את הקשר הספציפי?` : 'אני כאן לעזור לך עם שאלות אנלוגיות. איך אני יכול לעזור?'}`,
      
      `בואו נפרק את השאלה לחלקים:

${currentQuestion ? `
**השאלה:** ${currentQuestion.original_pair[0]} : ${currentQuestion.original_pair[1]}

**שלב 1:** זיהוי הקשר
- מה הקשר בין המילים בזוג המקורי?
- האם זה קשר של סיבה ותוצאה? חלק ושלם? ניגוד?

**שלב 2:** חיפוש התשובה
- חפש את האפשרות שמקיימת את אותו הקשר
- שלול אפשרויות שלא מתאימות

איך אתה רואה את הקשר בין המילים?` : 'אני כאן לעזור לך לפתור אנלוגיות. איזה חלק קשה לך?'}`,
      
      `אני כאן לעזור! 

${currentQuestion ? `
**השאלה:** ${currentQuestion.original_pair[0]} : ${currentQuestion.original_pair[1]}

**טיפים לפתרון אנלוגיות:**
1. **קרא בעיון** - הבן את המשמעות של כל מילה
2. **חפש קשרים** - סיבה/תוצאה, חלק/שלם, ניגוד, דמיון
3. **שלול תשובות** - מצא מה לא נכון
4. **בדוק הגיון** - האם התשובה שלך הגיונית?

איזה חלק קשה לך במיוחד?` : 'אני כאן לעזור לך עם שאלות אנלוגיות. איך אני יכול לעזור?'}`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

}

export const gptService = new GPTService();
