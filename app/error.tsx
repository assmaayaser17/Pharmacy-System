"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-x py-20 text-center space-y-5">
      <h1 className="text-2xl">صار خطأ غير متوقع</h1>
      <p className="text-muted">جرّب مرة ثانية، وإذا استمر الخطأ كلّمنا وبنساعدك.</p>
      <button onClick={reset} className="btn btn-primary btn-lg">حاول مرة ثانية</button>
    </div>
  );
}
