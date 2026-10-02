import { CategoriesPage } from "./features/categories/CategoriesPage";
import { UnitsPage } from "./features/units/UnitsPage";
import { BranchesPage } from "./features/branches/BranchesPage";
import { ProductsPage } from "./features/products/ProductsPage";

function App() {
  return (
    <>
      <CategoriesPage />
      <br />
      <UnitsPage />
      <br />
      <BranchesPage />
      <br />
      <ProductsPage />
    </>
  );
}

export default App;
