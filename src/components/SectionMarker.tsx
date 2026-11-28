export const SectionMarker = ({ children }: { children: React.ReactNode }) => (
  <p className="section-marker">
    <span className="section-marker-junction" aria-hidden="true" />
    {children}
  </p>
);