# CV 및 Cover Letter PDF 분리 생성 결과 보고서 (Walkthrough)

이 보고서는 마크다운 이력서 파일(_v3-수정_react_121_이력서및자기소개서수정.md)을 바탕으로 Cover Letter와 CV(이력서)를 추출하여 PDF로 분리 생성한 과정과 결과를 요약합니다.

## 변경 사항 및 작업 결과

1. **의존성 라이브러리 설치**: PDF 생성을 위해 `reportlab` 라이브러리를 설치하였습니다.
2. **파이썬 스크립트 작성**: [generate_pdf.py](file:///F:/pe/public_html/steelworks-manager-react/generate_pdf.py)를 새로 생성하였습니다.
    - 정규 표현식을 사용하여 마크다운 소스 파일의 `1. Revised Cover Letter` 및 `2. Revised Curriculum Vitae (CV)` 항목을 자동으로 파싱 및 분리합니다.
    - Windows 환경의 `malgun.ttf` 폰트를 동적으로 등록하여 영문 이력서 내 특수 문자 및 텍스트의 깨짐 현상을 미연에 방지하였습니다.
    - 글꼴 스타일, 문단 여백, 줄 바꿈, 불릿 리스트 처리를 깔끔히 다듬어 가독성을 확보하였습니다.
3. **PDF 생성 검증**:
    - 스크립트 실행을 통해 `Cover_Letter.pdf` 및 `CV_Brian_Park.pdf` 파일이 성공적으로 생성되었음을 확인하였습니다.

## 검증 방법

콘솔을 통해 `python generate_pdf.py` 명령을 실행하였으며 다음의 결과물이 생성되었습니다.
- [Cover_Letter.pdf](file:///F:/pe/public_html/steelworks-manager-react/Cover_Letter.pdf)
- [CV_Brian_Park.pdf](file:///F:/pe/public_html/steelworks-manager-react/CV_Brian_Park.pdf)
