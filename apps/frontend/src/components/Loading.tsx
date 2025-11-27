import {
    Item,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"

export function Loading({ text }: { text: string }) {
    return (
        <div className="first">
            <div className="flex flex-col w-full md:w-7xl h-[90vh] justify-center items-center gap-y-4">
                <Item variant="muted">
                    <ItemMedia>
                        <Spinner />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="line-clamp-1">{text}</ItemTitle>
                    </ItemContent>
                </Item>
            </div>
        </div>
    )
}
