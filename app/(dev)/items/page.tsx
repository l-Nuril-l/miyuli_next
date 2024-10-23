export default function ItemsPage() {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i}>{i}</div>
      ))}
    </div>
  );
}
