import {Menu} from 'lucide-react';
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Sheet,
} from './ui/sheet';

export default function MobileMenu() {
  return (
    <div className="sm:hidden">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent side={'right'}>
          <SheetHeader>
            <SheetTitle>this is mobile</SheetTitle>
          </SheetHeader>
          <span>this will be the content</span>
        </SheetContent>
      </Sheet>
    </div>
  );
}
