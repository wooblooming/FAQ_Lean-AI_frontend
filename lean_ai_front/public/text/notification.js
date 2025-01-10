import { Calendar, Bell } from 'lucide-react';

export const notifications = [
    {
      "id": 1,
      "title": "린에이아이 서비스 런칭 및 POC 진행 안내",
      "date": "2024-09-20",
      "content": `저희는 AI 기반 소상공인 고객 응대 솔루션을 공식적으로 런칭했습니다! 
      현재 POC(Proof of Concept) 단계로, 초기 도입 기업들을 대상으로 서비스의 효율성과 가치를 입증하고 있습니다.`,
      "icon": Bell
    },
    {
      "id": 2,
      "title": "9월 시스템 점검 안내",
      "date": "2024-09-10",
      "content": `9월 15일 새벽 2시부터 4시까지 시스템 점검이 예정되어 있습니다, 
      해당 시간 동안 서비스 이용이 제한될 수 있습니다.`,
      "icon": Calendar
    }
  ]