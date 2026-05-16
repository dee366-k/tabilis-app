"use client";

import { useState } from "react";

type Customer = {
  id: number;
  // Step 1
  name: string;
  email: string;
  phone: string;
  assignees: string[];
  status: string;
  // Step 2
  areas: string[];
  propertyTypes: string[];
  structures: string[];
  budget: string;
  yieldMin: string;
  ageMax: string;
  // Step 3
  ownFund: string;
  financings: string[];
  collateral: string;
  attributes: string[];
  age: string;
  // Step 4
  notes: string;
};

type FormData = Omit<Customer, "id">;

const emptyFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  assignees: [],
  status: "",
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

const ASSIGNEE_OPTIONS = ["門脇", "大森", "蔭西", "濵田"];
const PROPERTY_TYPE_OPTIONS = ["戸建", "アパート", "マンション", "商業ビル", "土地"];
const STRUCTURE_OPTIONS = ["RC造", "鉄骨造", "軽量鉄骨造", "木造"];
const FINANCING_OPTIONS = ["公庫", "地銀", "メガバンク", "ノンバンク", "信金", "未定"];
const ATTRIBUTE_OPTIONS = [
  "サラリーマン",
  "法人代表",
  "専業大家",
  "医師",
  "公務員",
  "その他",
];

function toggleButtonClass(selected: boolean): string {
  return selected
    ? "border border-[#1A3A5C] bg-[#1A3A5C] px-3 py-1.5 rounded cursor-pointer text-sm text-white transition"
    : "border border-[#C9BDA5] bg-white px-3 py-1.5 rounded cursor-pointer text-sm text-[#1A3A5C] transition hover:bg-[#F7F4EE]";
}

const inputClass =
  "mb-3 w-full rounded-sm border-2 border-[#C9BDA5] p-2 outline-none focus:border-[#B8985A]";

function statusBadgeClass(status: string): string {
  switch (status) {
    case "HOT":
      return "bg-red-100 text-red-700";
    case "検討中":
      return "bg-yellow-100 text-yellow-800";
    case "様子見":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function PracticePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showList, setShowList] = useState(false);
  const [inputArea, setInputArea] = useState("");

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function addArea() {
    const trimmed = inputArea.trim();
    if (trimmed === "") return;
    if (formData.areas.includes(trimmed)) {
      setInputArea("");
      return;
    }
    setFormData({ ...formData, areas: [...formData.areas, trimmed] });
    setInputArea("");
  }

  function removeArea(area: string) {
    setFormData({ ...formData, areas: formData.areas.filter((a) => a !== area) });
  }

  function toggleArrayValue<K extends keyof Customer>(
    field: K,
    value: string
  ) {
    const current = formData[field] as unknown as string[];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter((v) => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  }

  const handleNext = () => setCurrentStep((s) => s + 1);
  const handleBack = () => setCurrentStep((s) => s - 1);

  const handleComplete = () => {
    setCustomers((prev) => [
      ...prev,
      { id: Date.now(), ...formData },
    ]);
    setIsComplete(true);
  };

  const handleContinue = () => {
    setFormData(emptyFormData);
    setInputArea("");
    setCurrentStep(1);
    setIsComplete(false);
    setShowList(false);
  };

  const handleDelete = (id: number) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const canProceedStep1 = formData.name.trim() !== "";

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F7F4EE] px-4 pb-12 pt-12 font-serif">
      <header className="mb-8 flex w-[500px] flex-col items-center">
        <h1 className="text-3xl font-bold text-[#1A3A5C]">Tabilis 顧客追加</h1>

        <div className="mt-6 flex items-center gap-3">
          {[1, 2, 3, 4].map((step) => (
            <span
              key={step}
              className={`h-3 w-3 rounded-full ${
                step <= currentStep ? "bg-[#B8985A]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {!isComplete && (
          <p className="mt-4 text-[#4A4A4A]">
            ステップ {currentStep}/4：{STEP_NAMES[currentStep - 1]}
          </p>
        )}
      </header>

      <div className="w-[500px] rounded border border-[#C9BDA5] bg-white p-8 shadow">
        {isComplete ? (
          <div className="flex flex-col items-center text-center">
            <p className="text-3xl font-bold text-[#B8985A]">✓ 登録完了</p>
            <p className="mt-4 text-lg text-[#1A3A5C]">
              {formData.name} 様 を登録しました
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleContinue}
                className="rounded bg-[#1A3A5C] px-6 py-2 font-bold text-white hover:bg-[#0E2540]"
              >
                + 続けて登録
              </button>
              <button
                type="button"
                onClick={() => setShowList(true)}
                className="rounded bg-gray-200 px-6 py-2 font-bold text-gray-700 hover:bg-gray-300"
              >
                リストを見る
              </button>
            </div>
          </div>
        ) : (
          <>
            {currentStep === 1 && (
              <div>
                <label className="mb-1 block text-sm text-[#4A4A4A]">顧客名</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={inputClass}
                />
                <label className="mb-1 block text-sm text-[#4A4A4A]">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={inputClass}
                />
                <label className="mb-1 block text-sm text-[#4A4A4A]">電話番号</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={inputClass}
                />
                <div className="mb-3">
                  <label className="mb-1 block text-sm text-[#4A4A4A]">
                    担当者（複数選択可）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ASSIGNEE_OPTIONS.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleArrayValue("assignees", name)}
                        className={toggleButtonClass(formData.assignees.includes(name))}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="mb-1 block text-sm text-[#4A4A4A]">ステータス</label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className={inputClass}
                >
                  <option value="">選択してください</option>
                  <option value="HOT">HOT</option>
                  <option value="検討中">検討中</option>
                  <option value="様子見">様子見</option>
                </select>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceedStep1}
                    className="rounded bg-[#1A3A5C] px-6 py-2 font-bold text-white hover:bg-[#0E2540] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    次へ →
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <label className="mb-1 block text-sm text-[#4A4A4A]">
                  エリア（複数入力可）
                </label>
                <div className="mb-3">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={inputArea}
                      onChange={(e) => setInputArea(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addArea();
                        }
                      }}
                      placeholder="例：桑名（Enterで追加）"
                      className="flex-1 border-2 border-[#C9BDA5] p-2 rounded-sm"
                    />
                    <button
                      type="button"
                      onClick={addArea}
                      disabled={inputArea.trim() === ""}
                      className="bg-[#1A3A5C] text-white px-4 py-2 rounded hover:bg-[#0E2540] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + 追加
                    </button>
                  </div>
                  {formData.areas.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.areas.map((area) => (
                        <span
                          key={area}
                          className="inline-flex items-center gap-2 bg-[#B8985A] text-white px-3 py-1 rounded-full text-sm"
                        >
                          {area}
                          <button
                            type="button"
                            onClick={() => removeArea(area)}
                            className="hover:text-red-200 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      まだエリアが登録されていません
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm text-[#4A4A4A]">
                    物件種別（複数選択可）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPE_OPTIONS.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleArrayValue("propertyTypes", type)}
                        className={toggleButtonClass(
                          formData.propertyTypes.includes(type)
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm text-[#4A4A4A]">
                    構造（複数選択可）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STRUCTURE_OPTIONS.map((structure) => (
                      <button
                        key={structure}
                        type="button"
                        onClick={() => toggleArrayValue("structures", structure)}
                        className={toggleButtonClass(
                          formData.structures.includes(structure)
                        )}
                      >
                        {structure}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="mb-1 block text-sm text-[#4A4A4A]">価格上限</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => updateField("budget", e.target.value)}
                  placeholder="例：5,000万円"
                  className={inputClass}
                />
                <label className="mb-1 block text-sm text-[#4A4A4A]">利回り下限</label>
                <input
                  type="text"
                  value={formData.yieldMin}
                  onChange={(e) => updateField("yieldMin", e.target.value)}
                  placeholder="例：8%"
                  className={inputClass}
                />
                <label className="mb-1 block text-sm text-[#4A4A4A]">築年数上限</label>
                <input
                  type="text"
                  value={formData.ageMax}
                  onChange={(e) => updateField("ageMax", e.target.value)}
                  placeholder="例：15年"
                  className={inputClass}
                />
                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded bg-gray-200 px-6 py-2 font-bold text-gray-700 hover:bg-gray-300"
                  >
                    ← 戻る
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded bg-[#1A3A5C] px-6 py-2 font-bold text-white hover:bg-[#0E2540]"
                  >
                    次へ →
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <label className="mb-1 block text-sm text-[#4A4A4A]">自己資金</label>
                <input
                  type="text"
                  value={formData.ownFund}
                  onChange={(e) => updateField("ownFund", e.target.value)}
                  placeholder="例：1,000万円"
                  className={inputClass}
                />
                <div className="mb-3">
                  <label className="mb-1 block text-sm text-[#4A4A4A]">
                    融資希望先（複数選択可）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FINANCING_OPTIONS.map((financing) => (
                      <button
                        key={financing}
                        type="button"
                        onClick={() => toggleArrayValue("financings", financing)}
                        className={toggleButtonClass(
                          formData.financings.includes(financing)
                        )}
                      >
                        {financing}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="mb-1 block text-sm text-[#4A4A4A]">共同担保</label>
                <select
                  value={formData.collateral}
                  onChange={(e) => updateField("collateral", e.target.value)}
                  className={inputClass}
                >
                  <option value="">選択してください</option>
                  <option value="あり">あり</option>
                  <option value="なし">なし</option>
                  <option value="相談">相談</option>
                </select>
                <div className="mb-3">
                  <label className="mb-1 block text-sm text-[#4A4A4A]">
                    属性（複数選択可）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ATTRIBUTE_OPTIONS.map((attr) => (
                      <button
                        key={attr}
                        type="button"
                        onClick={() => toggleArrayValue("attributes", attr)}
                        className={toggleButtonClass(
                          formData.attributes.includes(attr)
                        )}
                      >
                        {attr}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="mb-1 block text-sm text-[#4A4A4A]">年齢</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className={inputClass}
                />
                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded bg-gray-200 px-6 py-2 font-bold text-gray-700 hover:bg-gray-300"
                  >
                    ← 戻る
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded bg-[#1A3A5C] px-6 py-2 font-bold text-white hover:bg-[#0E2540]"
                  >
                    次へ →
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <label className="mb-1 block text-sm text-[#4A4A4A]">特記事項</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows={5}
                  placeholder="例：鈴鹿サーキットF1観戦の民泊運用希望"
                  className={inputClass}
                />
                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded bg-gray-200 px-6 py-2 font-bold text-gray-700 hover:bg-gray-300"
                  >
                    ← 戻る
                  </button>
                  <button
                    type="button"
                    onClick={handleComplete}
                    className="rounded bg-[#B8985A] px-6 py-2 font-bold text-white hover:bg-[#9A7F4A]"
                  >
                    ✓ 登録完了
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {(showList || !isComplete) && customers.length > 0 && (
        <section className="mt-10 w-[500px]">
          <h2 className="text-xl font-bold text-[#1A3A5C]">
            登録顧客（{customers.length}件）
          </h2>
          <ul className="mt-4 space-y-4">
            {customers.map((customer) => (
              <li
                key={customer.id}
                className="rounded border border-[#C9BDA5] bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#1A3A5C]">
                      {customer.name}
                    </span>
                    {customer.status && (
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold ${statusBadgeClass(customer.status)}`}
                      >
                        {customer.status}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(customer.id)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    × 削除
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  担当者：
                  {customer.assignees.length > 0
                    ? customer.assignees.join(", ")
                    : "未割当"}
                </p>
                {(customer.areas.length > 0 ||
                  customer.propertyTypes.length > 0 ||
                  customer.structures.length > 0) && (
                  <p className="mt-1 text-sm text-[#B8985A]">
                    {[
                      customer.areas.length > 0
                        ? customer.areas.join(", ")
                        : "エリア未設定",
                      customer.propertyTypes.length > 0 &&
                        `物件種別 ${customer.propertyTypes.join(", ")}`,
                      customer.structures.length > 0 &&
                        `構造 ${customer.structures.join(", ")}`,
                    ]
                      .filter(Boolean)
                      .join(" / ")}
                  </p>
                )}
                {(customer.budget || customer.yieldMin || customer.ageMax) && (
                  <p className="mt-1 text-sm text-gray-500">
                    {[
                      customer.budget && `予算 ${customer.budget}`,
                      customer.yieldMin && `利回り ${customer.yieldMin}`,
                      customer.ageMax && `築年数 ${customer.ageMax}`,
                    ]
                      .filter(Boolean)
                      .join(" / ")}
                  </p>
                )}
                {(customer.ownFund ||
                  customer.financings.length > 0 ||
                  customer.attributes.length > 0) && (
                  <p className="mt-1 text-sm text-[#1A3A5C]">
                    {[
                      customer.ownFund && `自己資金 ${customer.ownFund}`,
                      customer.financings.length > 0 &&
                        `融資希望先 ${customer.financings.join(", ")}`,
                      customer.attributes.length > 0 &&
                        `属性 ${customer.attributes.join(", ")}`,
                    ]
                      .filter(Boolean)
                      .join(" / ")}
                  </p>
                )}
                {customer.notes && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                    {customer.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {showList && customers.length === 0 && (
        <p className="mt-10 text-gray-400">まだ顧客がいません</p>
      )}
    </div>
  );
}
