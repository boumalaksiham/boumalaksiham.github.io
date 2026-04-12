# Siham Boumalak
**Applied ML Researcher** — NLP · Computer Vision · E-Commerce ML · LLM Systems

M.S. Artificial Intelligence · Northeastern University, Khoury College · Expected 2027
Previously: Multi-agent LLM pipeline evaluation at Schneider Electric

---

## E-Commerce ML Portfolio

Built a 4-project ML system targeting the exact problems eBay, Amazon, and Shopify face at scale — entity resolution, taxonomy classification, attribute extraction, and image quality scoring.

### [Entity Resolution — Product Matching Pipeline](https://github.com/boumalaksiham/Entity-Resolution-Product-Matching-Pipeline)
`Sentence Transformers` `PyTorch` `scikit-learn` `Cosine Similarity`

Two-stage pipeline: Sentence Transformer (all-MiniLM-L6-v2) for semantic similarity + Attribute Guard that extracts model codes, storage sizes, and dimensions and applies a multiplicative penalty when they conflict.

**Key result:** Vanilla transformers scored Sony XM5 vs XM4 at 0.97 similarity — the Attribute Guard penalized this to 0.49, correctly predicting NO MATCH. Improved accuracy from **78% → 92%+** on 40 labeled product pairs.

---

### [Hierarchical Taxonomy Classifier — Fine-tuned DistilBERT](https://github.com/boumalaksiham/Taxonomy-Classifier-DistilBERT)
`HuggingFace Transformers` `DistilBERT` `PyTorch` `Multi-task Learning`

Shared-encoder multi-task architecture: one DistilBERT encoder (66M parameters) feeds three independent classification heads (5 / 12 / 18 classes) trained simultaneously with combined cross-entropy loss.

**Key result:** **100% Level 1 accuracy** by Epoch 7, **81% Level 3 accuracy** after 15 epochs. Out-of-distribution products always predicted the correct broad category, confirming real semantic structure was learned.

---

### [Product NER — Attribute Extraction from Titles](https://github.com/boumalaksiham/Product-NER-Attribute-Extraction)
`HuggingFace Transformers` `DistilBERT` `BIO Tagging` `seqeval`

BIO-tagged NER system extracting 9 attribute types from raw product titles: BRAND, MODEL, COLOR, STORAGE, SIZE, MATERIAL, NETWORK, GENERATION, COUNT. Handles multi-word entities (Le Creuset, Deep Purple, Cast Iron). Feeds directly into the Entity Resolution pipeline.

**Key result:** **F1=1.00 on BRAND**, F1=0.86 on STORAGE, F1=0.67 on COLOR. Span-level evaluation with seqeval (industry standard — partial matches don't count).

---

### [Product Image Quality Scorer — EfficientNet + CV Signals](https://github.com/boumalaksiham/Product-Image-Quality-Scorer)
`PyTorch` `EfficientNet-B0` `OpenCV` `torchvision`

Two-stage scorer combining EfficientNet-B0 (4.3M params, ImageNet pretrained, MSE regression head) with 7 classical CV signals: Laplacian sharpness, brightness, contrast, Hasler-Süsstrunk colorfulness, Canny edge density, resolution, and Gaussian noise.

**Key result:** Correctly ranked all 7 test images from highest to lowest quality. Generates actionable seller feedback: not just a score but specific issues and targeted recommendations ("Image is blurry → Use a tripod").

---

## Additional Projects

### [AI Guardian — LLM Observability Platform](https://github.com/boumalaksiham/AI-Guardian)
`FastAPI` `PostgreSQL` `React` `Python SDK` `SQLAlchemy` `LangChain`

Event-driven LLM observability platform. A Python SDK (`@track_llm_call`) wraps any LLM call and captures latency, token usage, cost, quality scores, and hallucination risk in real time — without changing application code. Threshold-based alerting and multi-step trace tracking for RAG pipelines and agent chains. Live React + Vite dashboard via WebSockets.

---

### [Scientific Paper Analysis — Multi-Agent NLP System](https://github.com/boumalaksiham/Final-Project-AI)
`HuggingFace` `PyTorch` `spaCy` `NetworkX` `arXiv API` `BART` `ROUGE`

5-agent pipeline analyzing arXiv papers: Summarization (BART), Citation Analysis (NetworkX knowledge graph), Methodology Extractor (spaCy NER), Critical Analysis, Coordinator. Evaluated with ROUGE and ablation studies.

**Key result:** **+0.31 ROUGE-1** over single-model baseline. Methodology Extractor was highest-impact agent — removing it caused the largest ROUGE drop across all 4 test papers.

---

### [Nexus-AI — Multi-Agent Facial Recognition Attendance](https://github.com/boumalaksiham/Nexus-AI-Attendance)
`OpenCV` `dlib` `Flask` `OpenAI API` `WebSockets`

Real-time attendance system using dlib HOG + 128D face embeddings across 3 dashboards (Admin, Professor, Student). OpenAI-powered absence reports and AI attendance chatbot. Reduced manual tracking to zero at The College of Wooster. **Awarded departmental Honors** — B.A. senior thesis.

---

### [Arabic Handwriting CNN — Character Classification](https://github.com/boumalaksiham/Arabic-Handwriting-CNN)
`PyTorch` `CNN` `Data Augmentation`

CNN trained from scratch on 13,440 labeled images across all 28 Arabic characters. Data augmentation (rotation, shear, zoom) for class imbalance. Confusion matrix analysis identified 3 character pairs with highest confusion rates.

**Key result: 92.4% test accuracy.**

---

## Stack

| Area | Tools |
|------|-------|
| NLP & Deep Learning | BERT · DistilBERT · Sentence Transformers · HuggingFace · PyTorch · BIO Tagging · seqeval · BART |
| Computer Vision | EfficientNet · ResNet · OpenCV · Laplacian · Canny · torchvision · dlib |
| ML & Evaluation | scikit-learn · F1 · AUC-ROC · ROUGE · Ablation Studies · AdamW · XGBoost |
| LLM & Agents | LangChain · AutoGen · LlamaIndex · OpenAI API · RAG · Prompt Engineering |
| Infrastructure | FastAPI · PostgreSQL · React · Flask · Python · SQL · Git · Linux |
| Languages | English · French · Arabic |

---

## Currently

- Seeking **Applied Researcher / ML Engineer** roles in e-commerce, NLP, or computer vision
- Open to F-1 CPT opportunities · Based in Boston, MA

---

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Siham_Boumalak-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/siham-boumalak-11014b210)
[![GitHub](https://img.shields.io/badge/GitHub-boumalaksiham-181717?style=flat-square&logo=github)](https://github.com/boumalaksiham)
[![Portfolio](https://img.shields.io/badge/Portfolio-boumalaksiham.github.io-378ADD?style=flat-square)](https://boumalaksiham.github.io)
