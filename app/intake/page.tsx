"use client";

import { useState } from "react";
import { supabase, toDb } from "../../lib/supabase";

type IntakeFormData = {
  name: string;
  email: string;
  phone: string;
  areas: string[];
  propertyTypes: string[];
  structures: string[];
  budget: string;
  yieldMin: string;
  ageMax: string;
  ownFund: string;
  financings: string[];
  collateral: string;
  attributes: string[];
  age: string;
  notes: string;
};

const emptyFormData: IntakeFormData = {
  name: "",
  email: "",
  phone: "",
  areas: [],
  propertyTypes: [],
  structures: [],
  budget: "",
  yieldMin: "",
  ageMax: "",
  ownFund: "",
  financings: [],
  collateral: "",
  attributes: [],
  age: "",
  notes: "",
};

const STEP_NAMES = ["基本情報", "希望条件", "資金面", "その他"];
const PROPERTY_TYPE_OPTIONS = ["戸建", "アパート", "マンション", "商業ビル", "土地"];
const STRUCTURE_OPTIONS = ["RC造", "鉄骨造", "軽量鉄骨造", "木造"];
const FINANCING_OPTIONS = ["公庫", "地銀", "メガバンク", "ノンバンク", "信金", "未定"];
const ATTRIBUTE_OPTIONS = ["サラリーマン", "法人代表", "専業大家", "医師", "公務員", "その他"];

function toggleButtonClass(selected: boolean): string {
  return selected
    ? "border border-[#1A3A5C] bg-[#1A3A5C] px-3 py-1.5 rounded cursor-pointer text-sm text-white transition"
    : "border border-[#C9BDA5] bg-white px-3 py-1.5 rounded cursor-pointer text-sm text-[#1A3A5C] transition hover:bg-[#F7F4EE]";
}

const inputClass = "mb-3 w-full rounded-sm border-2 border-[#C9BDA5] p-2 outline-none focus:border-[#B8985A]";

export default function IntakePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IntakeFormData>(emptyFormData);
  const [inputArea, setInputArea] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof IntakeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function addArea() {
    const trimmed = inputArea.trim();
    if (trimmed === "") return;
    if (formData.areas.includes(trimmed)) { setInputArea(""); return; }
    setFormData({ ...formData, areas: [...formData.areas, trimmed] });
    setInputArea("");
  }

  function removeArea(area: string) {
    setFormData({ ...formData, areas: formData.areas.filter((a) => a !== area) });
  }

  function toggleArrayValue<K extends keyof IntakeFormData>(field: K, value: string) {
    const current = formData[field] as unknown as string[];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter((v) => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  }

  const handleNext = () => setCurrentStep((s) => s + 1);
  const handleBack = () => setCurrentStep((s) => s - 1);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    const dbRow = toDb({ ...formData, assignees: [], status: "", source: "intake" });
    const { error } = await supabase.from("customers").insert(dbRow);
    setSubmitting(false);
    if (error) { setError(`送信エラー: ${error.message}`); return; }
    setIsSubmitted(true);
  }

  const canProceedStep1 = formData.name.trim() !== "";

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F4EE] px-4 font-serif">
        <div className="w-full max-w-md rounded border border-[#C9BDA5] bg-white p-10 text-center shadow">
          <p className="text-5xl">✓</p>
          <h1 className="mt-4 text-2xl font-bold text-[#1A3A5C]">送信が完了しました</h1>
          <p className="mt-4 text-[#4A4A4A]">{formData.name} 様、ご回答ありがとうございました。</p>
          <p className="mt-2 text-sm text-gray-500">担当者より追ってご連絡いたします。</p>
          <div className="mt-8 border-t border-[#C9BDA5] pt-6">
            <p className="text-xs text-gray-400">Tabilis ─ 不動産仲介の、新しい旅へ。</p>
            <p className="mt-1 text-xs text-gray-400">株式会社Mariage</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F7F4EE] px-4 pb-12 pt-12 font-serif">
      <header className="mb-8 flex w-full max-w-[500px] flex-col items-center">
        <h1 className="text-3xl font-bold text-[#1A3A5C]">投資物件 ご希望条件アンケート</h1>
        <p className="mt-2 text-sm text-[#4A4A4A]">株式会社Mariage</p>
        <p className="mt-1 text-xs text-gray-500">ご回答内容をもとに、最適な物件をご紹介いたします。</p>
        <div className="mt-6 flex items-center gap-3">
          {[1, 2, 3, 4].map((step) => (
            <span key={step} className={`h-3 w-3 rounded-full ${step <= currentStep ? "bg-[#B8985A]" : "bg-gray-300"}`} />
          ))}
        </div>
        <p className="mt-4 text-[#4A4A4A]">ステップ {currentStep}/4：{STEP_NAMES[currentStep - 1]}</p>
        {error && (<p className="mt-4 w-full rounded bg-red-100 p-3 text-sm text-red-700">{error}</p>)}
      </header>

      <div className="w-full max-w-[500px] rounded border border-[#C9BDA5] bg-white p-8 shadow">
        {currentStep === 1 && (
          <div>
            <label className="mb-1 block text-sm text-[#4A4A4A]">お名前 <span className="text-red-500">*</span></label>
            <input type="text" value={formData.name} onChange={(e) => updateField("name", e.target.value)} placeholder="例：松本由香理" className={inputClass} />
            <label className="mb-1 block text-sm text-[#4A4A4A]">メールアドレス</label>
            <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="例：example@gmail.com" className={inputClass} />
            <label className="mb-1 block text-sm text-[#4A4A4A]">電話番号</label>
            <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="例：090-1234-5678" className={inputClass} />
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={handleNext} disabled={!canProceedStep1} className="rounded bg-[#1A3A5C] px-6 py-2 font-bold text-white hover:bg-[#0E2540] disabled:cursor-not-allowed disabled:opacity-50">次へ →</button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <label className="mb-1 block text-sm text-[#4A4A4A]">ご希望エリア（複数入力可）</label>
            <div className="mb-3">
              <div className="flex gap-2 mb-2">
                <input type="text" value={inputArea} onChange={(e) => setInputArea(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addArea(); } }} placeholder="例：桑名（Enterで追加）" className="flex-1 border-2 border-[#C9BDA5] p-2 rounded-sm" />
                <button type="button" onClick={addArea} disabled={inputArea.trim() === ""} className="bg-[#1A3A5C] text-white px-4 py-2 rounded hover:bg-[#0E2540] disabled:opacity-50 disabled:cursor-not-allowed">+ 追加</button>
              </div>
              {formData.areas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.areas.map((area) => (
                    <span key={area} className="inline-flex items-center gap-2 bg-[#B8985A] text-white px-3 py-1 rounded-full text-sm">
                      {area}<button type="button" onClick={() => removeArea(area)} className="hover:text-red-200 font-bold">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-sm text-[#4A4A4A]">物件種別（複数選択可）</label>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPE_OPTIONS.map((type) => (
                  <button key={type} type="button" onClick={() => toggleArrayValue("propertyTypes", type)} className={toggleButtonClass(formData.propertyTypes.includes(type))}>{type}</button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-sm text-[#4A4A4A]">ご希望構造（複数選択可）</label>
              <div className="flex flex-wrap gap-2">
                {STRUCTURE_OPTIONS.map((structure) => (
                  <button key={structure} type="button" onClick={() => toggleArrayValue("structures", structure)} className={toggleButtonClass(formData.structures.includes(structure))}>{structure}</button>
                ))}
              </div>
            </div>
            <label className="mb-1 block text-sm text-[#4A4A4A]">ご予算上限</label>
            <input type="text" value={formData.budget} onChange={(e) => updateField("budget", e.target.value)} placeholder="例：5,000万円" className={inputClass} />
            <label className="mb-1 block text-sm text-[#4A4A4A]">希望利回り下限</label>
            <input type="text" value={formData.yieldMin} onChange={(e) => updateField("yieldMin", e.target.value)} placeholder="例：8%" className={inputClass} />
            <label className="mb-1 block text-sm text-[#4A4A4A]">築年数上限</label>
            <input type="text" value={formData.ageMax} onChange={(e) => updateField("ageMax", e.target.value)} placeholder="例：15年" className={inputClass} />
            <div className="mt-4 flex justify-between">
              <button type="button" onClick={handleBack} className="rounded bg-gray-200 px-6 py-2 font-bold text-gray-700 hover:bg-gray-300">← 戻る</button>
              <button type="button" onClick={handleNext} className="rounded bg-[#1A3A5C] px-6 py-2 font-bold text-white hover:bg-[#0E2540]">次へ →</button>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <label className="mb-1 block text-sm text-[#4A4A4A]">自己資金</label>
            <input type="text" value={formData.ownFund} onChange={(e) => updateField("ownFund", e.target.value)} placeholder="例：1,000万円" className={inputClass} />
            <div className="mb-3">
              <label className="mb-1 block text-sm text-[#4A4A4A]">ご希望融資先（複数選択可）</label>
              <div className="flex flex-wrap gap-2">
                {FINANCING_OPTIONS.map((financing) => (
                  <button key={financing} type="button" onClick={() => toggleArrayValue("financings", financing)} className={toggleButtonClass(formData.financings.includes(financing))}>{financing}</button>
                ))}
              </div>
            </div>
            <label className="mb-1 block text-sm text-[#4A4A4A]">共同担保</label>
            <select value={formData.collateral} onChange={(e) => updateField("collateral", e.target.value)} className={inputClass}>
              <option value="">選択してください</option>
              <option value="あり">あり</option>
              <option value="なし">なし</option>
              <option value="相談">相談</option>
            </select>
            <div className="mb-3">
              <label className="mb-1 block text-sm text-[#4A4A4A]">ご職業・属性（複数選択可）</label>
              <div className="flex flex-wrap gap-2">
                {ATTRIBUTE_OPTIONS.map((attr) => (
                  <button key={attr} type="button" onClick={() => toggleArrayValue("attributes", attr)} className={toggleButtonClass(formData.attributes.includes(attr))}>{attr}</button>
                ))}
              </div>
            </div>
            <label className="mb-1 block text-sm text-[#4A4A4A]">年齢</label>
            <input type="number" value={formData.age} onChange={(e) => updateField("age", e.target.value)} className={inputClass} />
            <div className="mt-4 flex justify-between">
              <button type="button" onClick={handleBack} className="rounded bg-gray-200 px-6 py-2 font-bold text-gray-700 hover:bg-gray-300">← 戻る</button>
              <button type="button" onClick={handleNext} className="rounded bg-[#1A3A5C] px-6 py-2 font-bold text-white hover:bg-[#0E2540]">次へ →</button>
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <div>
            <label className="mb-1 block text-sm text-[#4A4A4A]">その他・ご要望</label>
            <textarea value={formData.notes} onChange={(e) => updateField("notes", e.target.value)} rows={5} placeholder="例：民泊運用希望、駐車場必須、自宅から1時間以内 など" className={inputClass} />
            <div className="mt-4 flex justify-between">
              <button type="button" onClick={handleBack} className="rounded bg-gray-200 px-6 py-2 font-bold text-gray-700 hover:bg-gray-300">← 戻る</button>
              <button type="button" onClick={handleSubmit} disabled={submitting} className="rounded bg-[#B8985A] px-6 py-2 font-bold text-white hover:bg-[#9A7F4A] disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? "送信中..." : "✓ 送信する"}
              </button>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-10 text-center">
        <p className="text-xs text-gray-400">Tabilis ─ 不動産仲介の、新しい旅へ。</p>
      </footer>
    </div>
  );
}
