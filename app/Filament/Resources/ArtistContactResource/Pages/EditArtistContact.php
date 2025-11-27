<?php

namespace App\Filament\Resources\ArtistContactResource\Pages;

use App\Filament\Resources\ArtistContactResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditArtistContact extends EditRecord
{
    protected static string $resource = ArtistContactResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}