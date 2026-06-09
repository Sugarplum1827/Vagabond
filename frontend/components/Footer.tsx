export default function Footer() {
  return (
    <footer className="border-t border-[#e2e4ef] bg-white mt-20">
      <div className="page-container py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-lg text-[#0d0d14]">Vagabond</p>
            <p className="text-sm text-[#6b7a99] mt-1">
              Search scholarships &amp; universities worldwide for Filipino students
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-[#6b7a99]">
            <span>🔒 No account required</span>
            <span>🗑 Transcripts auto-deleted</span>
            <span>💰 100% free</span>
          </div>
        </div>
        <div className="border-t border-[#e2e4ef] mt-8 pt-6 text-xs text-[#9ba3be]">
          <p>
            Data sourced from publicly available university information. Always verify requirements directly with institutions.
            Vagabond is not affiliated with any university.
          </p>
        </div>
      </div>
    </footer>
  );
}
