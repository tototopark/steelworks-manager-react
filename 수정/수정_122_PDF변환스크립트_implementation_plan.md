# CV 및 Cover Letter PDF 분리 생성 파이썬 코드 구현 계획

이 계획서는 F:\pe\public_html\steelworks-manager-react\수정\_v3-수정_react_121_이력서및자기소개서수정.md 파일에서 Cover Letter와 CV(이력서)를 추출하여 각각 별도의 PDF 파일로 렌더링하는 파이썬 스크립트를 작성하기 위한 것입니다.

## User Review Required

PDF 생성을 위해 파이썬 라이브러리를 사용해야 합니다. 외부 시스템 종속성(예: wkhtmltopdf 등) 없이 파이썬 패키지만 설치하여 손쉽게 실행할 수 있도록 `reportlab` 또는 `fpdf2` 라이브러리를 사용하는 방안을 제안합니다. 여기서는 레이아웃 구성이 직관적이고 깔끔한 `reportlab` 또는 HTML 구조를 쉽게 변환할 수 있는 `xhtml2pdf` 중 설치와 실행이 가장 안정적인 `reportlab` 기반 구현을 제안합니다.

## Open Questions

없음.

## Proposed Changes

### PDF Generation Tool

#### [NEW] [generate_pdf.py](file:///F:/pe/public_html/steelworks-manager-react/generate_pdf.py)
마크다운 소스 파일(_v3-수정_react_121_이력서및자기소개서수정.md)을 읽어 Cover Letter와 CV 섹션으로 분리하고, 각각에 대해 스타일이 적용된 PDF 파일(Cover_Letter.pdf, CV_Brian_Park.pdf)을 생성하는 파이썬 스크립트입니다. 한글 폰트 지원 및 레이아웃 조정을 포함합니다.

## Verification Plan

### Manual Verification
1. `pip install reportlab` 명령을 실행하여 필요한 라이브러리를 설치합니다.
2. `python generate_pdf.py` 명령을 실행합니다.
3. 생성된 PDF 파일들의 레이아웃, 줄 바꿈, 폰트 스타일이 정상적으로 출력되는지 확인합니다.
