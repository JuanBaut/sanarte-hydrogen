import {Menu} from 'lucide-react';
import {Sheet, SheetContent, SheetTrigger} from './ui/sheet';

export default function MobileMenu() {
  return (
    <div className="sm:hidden">
      <Sheet>
        <SheetTrigger className="h-full">
          <Menu className="size-8 h-min my-auto text-primary-foreground" />
        </SheetTrigger>
        <SheetContent side={'right'}></SheetContent>
      </Sheet>
    </div>
  );
}
